import mongoose from "mongoose";
import { createError } from "../error.js"
import Progress from "../models/Progress.js"
import { ToolGroup, PracticalGroup } from "../models/Content.js";

// Create progress
export const createProgress = async (req, res, next) => {
    const { userId, moduleId, unitId } = req.params;
  
    if (userId !== req.user.id) {
      return next(createError(403, "Authorization error!"));
    }
  
    try {
      // Check if progress already exists
      let progressRecord = await Progress.findOne({ userId, moduleId, unitId });
  
      if (!progressRecord) {
        // Create new progress record with default value
        progressRecord = new Progress({
          userId,
          moduleId,
          unitId,
          progress: 0
        });
  
        await progressRecord.save();
      }
  
      res.status(201).json(progressRecord);
    } catch (error) {
      next(error);
    }
};


// update user progress
export const updateProgress = async (req, res, next) => {
  const { userId, moduleId, unitId, groupId, groupType } = req.params;

  if (userId !== req.user.id) {
    return next(createError(403, "Authorization error!"));
  }

  try {
    // Fetch total number of tool groups and practical groups in the unit
    const totalToolGroups = await ToolGroup.countDocuments({ unitId });
    const totalPracticalGroups = await PracticalGroup.countDocuments({ unitId });

    // Calculate progress based on the total counts
    const totalGroups = totalToolGroups + totalPracticalGroups;
    const increment = 100 / totalGroups; // Assuming each group contributes equally

    // Find or create progress record
    let progressRecord = await Progress.findOne({ userId, moduleId, unitId });

    if (!progressRecord) {
      progressRecord = new Progress({
        userId,
        moduleId,
        unitId,
        completedGroups: [],
        progress: 0, // Start with 0
      });
    }


    if (!progressRecord.completedGroups.some(group => group.groupId.toString() === groupId)) {
      // Add group to completedGroups
      progressRecord.completedGroups.push({ groupId, groupType });

      // Update the progress value
      progressRecord.progress += increment;

      // Ensure progress does not exceed 100
      progressRecord.progress = Math.min(progressRecord.progress, 100);

      await progressRecord.save();
    }

    res.status(200).json(progressRecord);
  } catch (error) {
    next(error);
  }
};

// update progress for all users when a tool/practical group has been added
export const updateProgressForAll = async (unitId, removedGroupId = null) => {
  try {
    // Fetch total number of active tool groups and practical groups in the unit
    const [totalToolGroups, totalPracticalGroups] = await Promise.all([
      ToolGroup.countDocuments({ unitId, archived: false }),
      PracticalGroup.countDocuments({ unitId, archived: false })
    ]);

    // Calculate progress based on the new total counts
    const totalGroups = totalToolGroups + totalPracticalGroups;

    // Fetch all progress records for the unit
    const usersProgress = await Progress.find({ unitId });

    for (let progressRecord of usersProgress) {
      // Remove the group from completedGroups if removedGroupId is provided
      if (removedGroupId) {
        progressRecord.completedGroups = progressRecord.completedGroups.filter(group => group.groupId.toString() !== removedGroupId.toString());
      }

      // Count completed groups for this user
      const completedGroupsCount = progressRecord.completedGroups.length;

      // Calculate progress based on completed groups
      const increment = totalGroups > 0 ? (completedGroupsCount / totalGroups) * 100 : 0;

      // Update progress for the user
      progressRecord.progress = increment;
      await progressRecord.save();
    }

    return usersProgress; // Return updated progress records if needed
  } catch (error) {
    throw error; // Rethrow the error for handling in the caller function
  }
};



// // Fetch user progress 
// export const getProgress = async (req, res, next) => {
//     const { userId, moduleId, unitId } = req.params;

//     if (userId !== req.user.id) {
//         return next(createError(403, "Authorization error!"));
//     }

//     try {
//       const progressRecord = await Progress.findOne({ userId, moduleId, unitId });
//       if (!progressRecord) {
//         return res.status(404).json({ message: 'Progress not found.' });
//       }
//       res.status(200).json(progressRecord);
//     } catch (error) {
//       next(error);
//     }
// };

export const getProgress = async (req, res, next) => {
  const { userId, moduleId, unitId } = req.params;

  if (userId !== req.user.id) {
      return next(createError(403, "Authorization error!"));
  }

  try {
      // Find progress record for the user and populate unit and module details
      const progressRecord = await Progress.findOne({ userId, moduleId, unitId })
          .populate('unitId', 'title')
          .populate('moduleId', 'title');

      if (!progressRecord) {
          return res.status(404).json({ message: 'Progress not found.' });
      }

      res.status(200).json(progressRecord);
  } catch (error) {
      next(error);
  }
};


// Fetch all progress records for the current user
export const getProgresses = async (req, res, next) => {
  const { userId } = req.params;

  if (userId !== req.user.id) {
    return next(createError(403, "Authorization error!"));
  }

  try {
    // Find all progress records for the current user
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
      })
      .sort({ updatedAt: -1 });

    // Map progresses to include courseTitle from moduleId.courseId
    const progressesWithCourseTitle = progresses.map(progress => ({
      ...progress.toObject(), // Convert Mongoose document to plain JavaScript object
      courseTitle: progress.moduleId.courseId.title // Access course title through moduleId.courseId.title
    }));

    res.status(200).json(progressesWithCourseTitle);
  } catch (error) {
    next(error);
  }
};