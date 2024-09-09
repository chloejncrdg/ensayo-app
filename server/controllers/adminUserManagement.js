import User from "../models/User.js"
import { Module, Course } from '../models/Content.js'
import Progress from '../models/Progress.js'


// count all users 
export const countTotalUsers = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        res.status(200).json({ totalUsers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// count users with wherein length of "enrolled courses" are more than 0
export const countUsersWithEnrolledCourses = async (req, res) => {
    try {
        const usersWithEnrolledCourses = await User.countDocuments({ enrolledCourses: { $exists: true, $not: { $size: 0 } } });
        res.status(200).json({ usersWithEnrolledCourses });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// count users enrolled for each course
export const countUsersEnrolledInCourses = async (req, res) => {
    try {
        // Aggregate the users by their enrolled courses and count
        const results = await User.aggregate([
            { $unwind: '$enrolledCourses' },
            {
                $lookup: {
                    from: 'modules',
                    localField: 'enrolledCourses',
                    foreignField: '_id',
                    as: 'module'
                }
            },
            { $unwind: '$module' },
            {
                $lookup: {
                    from: 'courses',
                    localField: 'module.courseId',
                    foreignField: '_id',
                    as: 'course'
                }
            },
            { $unwind: '$course' },
            {
                $group: {
                    _id: '$course._id',
                    title: { $first: '$course.title' },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: 'Error counting users enrolled in courses' });
    }
};

// export const getAllUsers = async (req, res) => {
//     try {
//         const users = await User.find().select('-password -address');
//         res.status(200).json(users);
//     } catch (error) {
//         res.status(500).json({ error: 'Error fetching users' });
//     }
// };

// with pagination
export const getAllUsers = async (req, res) => {
    try {
      const { page = 1, perPage = 20, search = '' } = req.query;
      const skip = (page - 1) * perPage;
  
      let query = {};
      if (search) {
        query = {
          $or: [
            { firstName: { $regex: search, $options: 'i' } }, // Case-insensitive regex search
            { lastName: { $regex: search, $options: 'i' } },
            { username: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        };
      }
  
      const users = await User.find(query)
        .select('-password -address')
        .skip(skip)
        .limit(perPage);
  
      const totalUsers = await User.countDocuments(query);
  
      res.status(200).json({
        users,
        totalPages: Math.ceil(totalUsers / perPage),
        currentPage: page,
        perPage
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Error fetching users' });
    }
  };

export const getUserDetails = async (req, res, next) => {
    const userId = req.params.userId; // Assuming the route parameter is userId
  
    try {
      // Fetch user details including enrolledCourses
      const user = await User.findById(userId).populate({
        path: 'enrolledCourses',
        select: 'title', // Select only the title of each enrolled module
      });
  
      if (!user) {
        return next(createError(404, 'User not found'));
      }
  
      // Fetch progress records for the user
      const progresses = await Progress.find({ userId })
        .populate({
          path: 'unitId',
          select: 'title image', // Specify fields to select: title and image
        })
        .populate({
          path: 'moduleId',
          select: 'title courseId', // Select moduleId and courseId
          populate: {
            path: 'courseId',
            select: 'title', // Select course title
          }
        });
  
      // Map progresses to include courseTitle from moduleId.courseId
      const progressesWithCourseTitle = progresses.map(progress => ({
        ...progress.toObject(), // Convert Mongoose document to plain JavaScript object
        courseTitle: progress.moduleId.courseId.title // Access course title through moduleId.courseId.title
      }));
  
      // Prepare response object
      const userDetails = {
        _id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        enrolledCourses: user.enrolledCourses.map(course => course.title),
        progress: progressesWithCourseTitle,
      };
  
      res.status(200).json(userDetails);
    } catch (error) {
      next(error);
    }
  };