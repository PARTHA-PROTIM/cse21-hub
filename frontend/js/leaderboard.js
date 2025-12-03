checkAuth();

let allCourses = [];

document.addEventListener('DOMContentLoaded', async () => {
    const token = getToken();
    const courseSelect = document.getElementById('courseSelect');
    
    try {
        // Load courses
        const coursesRes = await fetch(`${API_URL}/courses`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        allCourses = await coursesRes.json();
        
        courseSelect.innerHTML = '<option value="">Select a course</option>' +
            allCourses.map(c => `<option value="${c._id}">${c.courseCode} - ${c.courseName}</option>`).join('');
        
        // Check if course ID in URL
        const urlParams = new URLSearchParams(window.location.search);
        const courseId = urlParams.get('course');
        if (courseId) {
            courseSelect.value = courseId;
            loadLeaderboard(courseId);
        }
        
        courseSelect.addEventListener('change', (e) => {
            if (e.target.value) {
                loadLeaderboard(e.target.value);
            }
        });
        
    } catch (error) {
        console.error('Error loading courses:', error);
    }
});

async function loadLeaderboard(courseId) {
    const token = getToken();
    const container = document.getElementById('leaderboardContainer');
    
    try {
        const response = await fetch(`${API_URL}/marks/leaderboard/${courseId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const marks = await response.json();
        
        if (marks.length > 0) {
            container.innerHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Name</th>
                            <th>Reg No</th>
                            <th>Test 1</th>
                            <th>Test 2</th>
                            <th>Quiz</th>
                            <th>Assignment</th>
                            <th>Final</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${marks.map((mark, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${mark.student.name}</td>
                                <td>${mark.student.regNo}</td>
                                <td>${mark.marks.test1}</td>
                                <td>${mark.marks.test2}</td>
                                <td>${mark.marks.quiz}</td>
                                <td>${mark.marks.assignment}</td>
                                <td>${mark.marks.final}</td>
                                <td><strong>${mark.totalMarks}</strong></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            container.innerHTML = '<p>No marks available for this course</p>';
        }
    } catch (error) {
        console.error('Error loading leaderboard:', error);
        container.innerHTML = '<p>Error loading leaderboard</p>';
    }
}