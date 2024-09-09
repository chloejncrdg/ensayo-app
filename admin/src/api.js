import axios from 'axios';

const axiosInstance = axios.create({
	baseURL:process.env.REACT_APP_API_URL,
});

export const fetchAllUsers = async (page = 1, perPage = 20, search = '') => {
    try {
      const response = await axiosInstance.get('/userManagement/getUsers', {
        params: {
          page,
          perPage,
          search
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
};

// Fetch total number of users
export const fetchTotalUsers = async () => {
    const response = await axiosInstance.get(`/userManagement/countTotalUsers`);
    return response.data.totalUsers;
};

// Fetch total number of users with enrolled courses
export const fetchUsersWithEnrolledCourses = async () => {
    const response = await axiosInstance.get(`/userManagement/countEnrolledUsers`);
    return response.data.usersWithEnrolledCourses;
};

// Fetch users enrolled in each course
export const fetchUsersEnrolledInCourses = async () => {
    const response = await axiosInstance.get(`/userManagement/courseEnrollees`);
    return response.data;
};
