checkAuth();

document.addEventListener('DOMContentLoaded', async () => {
    const token = getToken();
    const coursesList = document.getElementById('coursesList');
    
    try {
        const response = await fetch(`${API_URL}/courses`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const courses = await response.json();
        
        if (courses.length > 0) {
            coursesList.innerHTML = courses.map(course => `
                <div class="course-card">
                    <div class="course-code">${course.courseCode}</div>
                    <h3>${course.courseName}</h3>
                    <p class="course-info">Credit: ${course.credit}</p>
                    <p class="course-info">Semester: ${course.semester}</p>
                    <p class="course-info">Teacher: ${course.teacher}</p>
                    <button class="btn btn-primary" onclick="viewCourseDetails('${course._id}')">
                        View Details
                    </button>
                </div>
            `).join('');
        } else {
            coursesList.innerHTML = '<p>No courses available</p>';
        }
    } catch (error) {
        console.error('Error loading courses:', error);
        coursesList.innerHTML = '<p>Error loading courses</p>';
    }
});

function viewCourseDetails(courseId) {
    window.location.href = `leaderboard.html?course=${courseId}`;
}