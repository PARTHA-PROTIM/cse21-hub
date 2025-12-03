
window.approveRequest = approveRequest;
window.rejectRequest = rejectRequest;
window.deleteCourse = deleteCourse;
window.deleteBusSchedule = deleteBusSchedule;
window.deleteContest = deleteContest;
window.deleteNews = deleteNews;


checkAuth();
checkAdminAuth();

const token = getToken();

document.addEventListener('DOMContentLoaded', () => {
    // Section navigation
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.target.dataset.section;
            showSection(section);
            
            sidebarLinks.forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');
        });
    });
    
    // Load initial section
    loadPendingRequests();
    
    // Setup form handlers
    setupCourseHandlers();
    setupMarksHandlers();
    setupBusHandlers();
    setupContestHandlers();
    setupNewsHandlers();
});

function showSection(sectionId) {
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    
    // Load data for the section
    switch(sectionId) {
        case 'requests':
            loadPendingRequests();
            break;
        case 'courses':
            loadCourses();
            break;
        case 'marks':
            loadCoursesForMarks();
            break;
        case 'bus':
            loadBusSchedules();
            break;
        case 'contests':
            loadContests();
            break;
        case 'news':
            loadNewsAdmin();
            break;
        case 'users':  
            loadUsers();
            break;
    }
}

// ========== Registration Requests ==========
async function loadPendingRequests() {
    const requestsList = document.getElementById('requestsList');
    
    try {
        const response = await fetch(`${API_URL}/registration-requests`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load requests');
        }
        
        const requests = await response.json();
        console.log('Loaded requests:', requests);
        
        if (requests.length > 0) {
            requestsList.innerHTML = requests.map(req => `
                <div class="request-card">
                    <div class="request-info">
                        <h4>${req.name}</h4>
                        <p>Email: ${req.email}</p>
                        <p>Reg No: ${req.regNo}</p>
                        <p>Date: ${new Date(req.createdAt || req.requestedAt).toLocaleDateString()}</p>
                    </div>
                    <div class="request-actions">
                        <button class="btn btn-success" onclick="window.approveRequest('${req._id}')">
                            Approve
                        </button>
                        <button class="btn btn-danger" onclick="window.rejectRequest('${req._id}')">
                            Reject
                        </button>
                    </div>
                </div>
            `).join('');
        } else {
            requestsList.innerHTML = '<p>No pending requests</p>';
        }
    } catch (error) {
        console.error('Error loading requests:', error);
        requestsList.innerHTML = '<p>Error loading requests. Check console.</p>';
    }
}

async function approveRequest(requestId) {
    try {
        const response = await fetch(`${API_URL}/registration-requests/${requestId}/approve`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            alert('User approved successfully!');
            loadPendingRequests();
        }
    } catch (error) {
        console.error('Error approving request:', error);
        alert('Failed to approve user');
    }
}

async function rejectRequest(requestId) {
    try {
        const response = await fetch(`${API_URL}/registration-requests/${requestId}/reject`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            alert('Request rejected');
            loadPendingRequests();
        }
    } catch (error) {
        console.error('Error rejecting request:', error);
        alert('Failed to reject request');
    }
}

// ========== Courses ==========
function setupCourseHandlers() {
    const addCourseBtn = document.getElementById('addCourseBtn');
    const cancelCourseBtn = document.getElementById('cancelCourseBtn');
    const courseForm = document.getElementById('courseForm');
    const formContainer = document.getElementById('courseFormContainer');
    
    addCourseBtn.addEventListener('click', () => {
        formContainer.style.display = 'block';
    });
    
    cancelCourseBtn.addEventListener('click', () => {
        formContainer.style.display = 'none';
        courseForm.reset();
    });
    
    courseForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const courseData = {
            courseCode: document.getElementById('courseCode').value,
            courseName: document.getElementById('courseName').value,
            credit: document.getElementById('credit').value,
            semester: document.getElementById('semester').value,
            teacher: document.getElementById('teacher').value,
            markDistribution: {
                test1: parseInt(document.getElementById('test1').value),
                test2: parseInt(document.getElementById('test2').value),
                quiz: parseInt(document.getElementById('quiz').value),
                assignment: parseInt(document.getElementById('assignment').value),
                final: parseInt(document.getElementById('final').value),
            }
        };
        
        try {
            const response = await fetch(`${API_URL}/courses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(courseData)
            });
            
            if (response.ok) {
                alert('Course added successfully!');
                courseForm.reset();
                formContainer.style.display = 'none';
                loadCourses();
            }
        } catch (error) {
            console.error('Error adding course:', error);
            alert('Failed to add course');
        }
    });
}

async function loadCourses() {
    const coursesList = document.getElementById('coursesList');
    
    try {
        const response = await fetch(`${API_URL}/courses`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const courses = await response.json();
        
        if (courses.length > 0) {
            coursesList.innerHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Course Code</th>
                            <th>Course Name</th>
                            <th>Credit</th>
                            <th>Semester</th>
                            <th>Teacher</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${courses.map(course => `
                            <tr>
                                <td>${course.courseCode}</td>
                                <td>${course.courseName}</td>
                                <td>${course.credit}</td>
                                <td>${course.semester}</td>
                                <td>${course.teacher}</td>
                                <td>
                                    <button class="btn btn-danger" onclick="deleteCourse('${course._id}')">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            coursesList.innerHTML = '<p>No courses available</p>';
        }
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

async function deleteCourse(courseId) {
    if (!confirm('Are you sure you want to delete this course?')) return;
    
    try {
        const response = await fetch(`${API_URL}/courses/${courseId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            alert('Course deleted successfully!');
            loadCourses();
        }
    } catch (error) {
        console.error('Error deleting course:', error);
        alert('Failed to delete course');
    }
}

// ========== Marks ==========
function setupMarksHandlers() {
    const marksForm = document.getElementById('marksForm');
    
    marksForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const studentRegNo = document.getElementById('studentRegNo').value.trim();
        const courseId = document.getElementById('markCourse').value;
        
        if (!courseId) {
            alert('Please select a course');
            return;
        }
        
        if (!studentRegNo) {
            alert('Please enter student registration number');
            return;
        }
        
        const marksData = {
            studentRegNo: studentRegNo,
            courseId: courseId,
            marks: {
                test1: parseInt(document.getElementById('markTest1').value) || 0,
                test2: parseInt(document.getElementById('markTest2').value) || 0,
                quiz: parseInt(document.getElementById('markQuiz').value) || 0,
                assignment: parseInt(document.getElementById('markAssignment').value) || 0,
                final: parseInt(document.getElementById('markFinal').value) || 0,
            }
        };
        
        console.log('Submitting marks:', marksData);
        
        try {
            const response = await fetch(`${API_URL}/marks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(marksData)
            });
            
            const data = await response.json();
            console.log('Marks update response:', data);
            
            if (response.ok) {
                alert(`✅ Marks updated successfully for ${data.student.name}!`);
                marksForm.reset();
            } else {
                alert('❌ Error: ' + (data.message || 'Failed to update marks'));
            }
        } catch (error) {
            console.error('Error updating marks:', error);
            alert('❌ Failed to update marks. Check console for details.');
        }
    });
}

async function loadCoursesForMarks() {
    const select = document.getElementById('markCourse');
    
    try {
        const response = await fetch(`${API_URL}/courses`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const courses = await response.json();
        
        select.innerHTML = '<option value="">Select Course</option>' +
            courses.map(c => `<option value="${c._id}">${c.courseCode} - ${c.courseName}</option>`).join('');
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

// ========== Bus Schedules ==========
function setupBusHandlers() {
    const addBusBtn = document.getElementById('addBusBtn');
    const cancelBusBtn = document.getElementById('cancelBusBtn');
    const busForm = document.getElementById('busForm');
    const formContainer = document.getElementById('busFormContainer');
    
    addBusBtn.addEventListener('click', () => {
        formContainer.style.display = 'block';
    });
    
    cancelBusBtn.addEventListener('click', () => {
        formContainer.style.display = 'none';
        busForm.reset();
    });
    
    busForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const busData = {
            routeName: document.getElementById('routeName').value,
            departureTime: document.getElementById('departureTime').value,
            destination: document.getElementById('destination').value,
        };
        
        try {
            const response = await fetch(`${API_URL}/bus`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(busData)
            });
            
            if (response.ok) {
                alert('Bus schedule added successfully!');
                busForm.reset();
                formContainer.style.display = 'none';
                loadBusSchedules();
            }
        } catch (error) {
            console.error('Error adding bus schedule:', error);
            alert('Failed to add bus schedule');
        }
    });
}

async function loadBusSchedules() {
    const busList = document.getElementById('busList');
    
    try {
        const response = await fetch(`${API_URL}/bus`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const schedules = await response.json();
        
        if (schedules.length > 0) {
            busList.innerHTML = schedules.map(bus => `
                <div class="request-card">
                    <div class="request-info">
                        <h4>${bus.routeName}</h4>
                        <p>Time: ${bus.departureTime}</p>
                        <p>Destination: ${bus.destination}</p>
                    </div>
                    <button class="btn btn-danger" onclick="deleteBusSchedule('${bus._id}')">
                        Delete
                    </button>
                </div>
            `).join('');
        } else {
            busList.innerHTML = '<p>No bus schedules available</p>';
        }
    } catch (error) {
        console.error('Error loading bus schedules:', error);
    }
}

async function deleteBusSchedule(id) {
    if (!confirm('Delete this schedule?')) return;
    
    try {
        await fetch(`${API_URL}/bus/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        loadBusSchedules();
    } catch (error) {
        console.error('Error deleting schedule:', error);
    }
}

// ========== Contests ==========
function setupContestHandlers() {
    const addBtn = document.getElementById('addContestBtn');
    const cancelBtn = document.getElementById('cancelContestBtn');
    const form = document.getElementById('contestForm');
    const container = document.getElementById('contestFormContainer');
    
    addBtn.addEventListener('click', () => container.style.display = 'block');
    cancelBtn.addEventListener('click', () => {
        container.style.display = 'none';
        form.reset();
    });
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const data = {
            title: document.getElementById('contestTitle').value,
            description: document.getElementById('contestDesc').value,
            platform: document.getElementById('platform').value,
            contestUrl: document.getElementById('contestUrl').value,
            startTime: document.getElementById('startTime').value,
            endTime: document.getElementById('endTime').value,
        };
        
        try {
            await fetch(`${API_URL}/contests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            
            alert('Contest added!');
            form.reset();
            container.style.display = 'none';
            loadContests();
        } catch (error) {
            console.error('Error:', error);
        }
    });
}

async function loadContests() {
    const list = document.getElementById('contestsList');
    
    try {
        const response = await fetch(`${API_URL}/contests`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const contests = await response.json();
        
        if (contests.length > 0) {
            list.innerHTML = contests.map(c => `
                <div class="request-card">
                    <div class="request-info">
                        <h4>${c.title}</h4>
                        <p>${c.description}</p>
                        <p>Platform: ${c.platform}</p>
                        <p>Start: ${new Date(c.startTime).toLocaleString()}</p>
                    </div>
                    <button class="btn btn-danger" onclick="deleteContest('${c._id}')">Delete</button>
                </div>
            `).join('');
        } else {
            list.innerHTML = '<p>No contests</p>';
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function deleteContest(id) {
    if (!confirm('Delete?')) return;
    try {
        await fetch(`${API_URL}/contests/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        loadContests();
    } catch (error) {
        console.error('Error:', error);
    }
}

// ========== News ==========
function setupNewsHandlers() {
    const addBtn = document.getElementById('addNewsBtn');
    const cancelBtn = document.getElementById('cancelNewsBtn');
    const form = document.getElementById('newsForm');
    const container = document.getElementById('newsFormContainer');
    
    addBtn.addEventListener('click', () => container.style.display = 'block');
    cancelBtn.addEventListener('click', () => {
        container.style.display = 'none';
        form.reset();
    });
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const data = {
            title: document.getElementById('newsTitle').value,
            content: document.getElementById('newsContent').value,
            category: document.getElementById('newsCategory').value,
        };
        
        try {
            await fetch(`${API_URL}/news`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            
            alert('News published!');
            form.reset();
            container.style.display = 'none';
            loadNewsAdmin();
        } catch (error) {
            console.error('Error:', error);
        }
    });
}

async function loadNewsAdmin() {
    const list = document.getElementById('newsListAdmin');
    
    try {
        const response = await fetch(`${API_URL}/news`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const news = await response.json();
        
        if (news.length > 0) {
            list.innerHTML = news.map(n => `
                <div class="request-card">
                    <div class="request-info">
                        <h4>${n.title}</h4>
                        <p>${n.content.substring(0, 100)}...</p>
                        <p>Category: ${n.category}</p>
                        <p>Date: ${new Date(n.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button class="btn btn-danger" onclick="deleteNews('${n._id}')">Delete</button>
                </div>
            `).join('');
        } else {
            list.innerHTML = '<p>No news</p>';
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function deleteNews(id) {
    if (!confirm('Delete?')) return;
    try {
        await fetch(`${API_URL}/news/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        loadNewsAdmin();
    } catch (error) {
        console.error('Error:', error);
    }
}
    // ========== User Management ==========
// ========== User Management ==========
async function loadUsers() {
    const usersList = document.getElementById('usersList');
    
    if (!usersList) {
        console.error('usersList element not found!');
        return;
    }
    
    usersList.innerHTML = '<p style="text-align: center; padding: 2rem;">Loading users...</p>';
    
    try {
        console.log('Fetching users...');
        
        const response = await fetch(`${API_URL}/users`, {
            headers: { 
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const users = await response.json();
        console.log('Users loaded:', users);
        
        if (!users || users.length === 0) {
            usersList.innerHTML = '<p>No users found in database.</p>';
            return;
        }
        
        // Get current user to check if CR
        const currentUser = getUser();
        const isCR = currentUser && currentUser.role === 'cr';
        
        // Create table
        let tableHTML = `
            <table style="width: 100%; background: white; border-collapse: collapse; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border-radius: 10px; overflow: hidden;">
                <thead>
                    <tr style="background: #f8f9fa;">
                        <th style="padding: 1rem; text-align: left; font-weight: 600; color: #2c3e50;">Name</th>
                        <th style="padding: 1rem; text-align: left; font-weight: 600; color: #2c3e50;">Email</th>
                        <th style="padding: 1rem; text-align: left; font-weight: 600; color: #2c3e50;">Reg Number</th>
                        <th style="padding: 1rem; text-align: left; font-weight: 600; color: #2c3e50;">Role</th>
                        <th style="padding: 1rem; text-align: left; font-weight: 600; color: #2c3e50;">Status</th>`;
        
        if (isCR) {
            tableHTML += `<th style="padding: 1rem; text-align: left; font-weight: 600; color: #2c3e50;">Actions</th>`;
        }
        
        tableHTML += `</tr></thead><tbody>`;
        
        // Add user rows
        users.forEach(user => {
            tableHTML += `
                <tr style="border-bottom: 1px solid #ecf0f1;">
                    <td style="padding: 1rem;">${user.name}</td>
                    <td style="padding: 1rem;">${user.email}</td>
                    <td style="padding: 1rem; font-weight: 600;">${user.regNo}</td>
                    <td style="padding: 1rem;">
                        <span style="
                            background: ${user.role === 'cr' ? '#e74c3c' : '#3498db'};
                            color: white;
                            padding: 0.4rem 0.8rem;
                            border-radius: 15px;
                            font-size: 0.8rem;
                            font-weight: bold;
                            text-transform: uppercase;
                            display: inline-block;
                        ">
                            ${user.role}
                        </span>
                    </td>
                    <td style="padding: 1rem;">
                        <span style="color: ${user.isApproved ? '#27ae60' : '#e67e22'}; font-weight: bold;">
                            ${user.isApproved ? '✓ Approved' : '⏳ Pending'}
                        </span>
                    </td>`;
            
            if (isCR) {
                if (user.role === 'cr') {
                    tableHTML += `
                        <td style="padding: 1rem;">
                            <span style="color: #95a5a6; font-style: italic; font-size: 0.9rem;">🔒 Protected</span>
                        </td>`;
                } else {
                    tableHTML += `
                        <td style="padding: 1rem;">
                            <button 
                                class="btn btn-danger" 
                                onclick="removeUserAccount('${user._id}', '${user.name.replace(/'/g, "\\'")}', '${user.regNo}')"
                                style="padding: 0.5rem 1rem; font-size: 0.9rem;">
                                🗑️ Remove
                            </button>
                        </td>`;
                }
            }
            
            tableHTML += `</tr>`;
        });
        
        tableHTML += `</tbody></table>`;
        
        // Display summary
        const studentCount = users.filter(u => u.role === 'student').length;
        const crCount = users.filter(u => u.role === 'cr').length;
        
        usersList.innerHTML = `
            <div style="background: white; padding: 1.5rem; border-radius: 10px; margin-bottom: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h3 style="margin-bottom: 1rem; color: #2c3e50;">📊 Summary</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                    <div style="background: #3498db; color: white; padding: 1rem; border-radius: 8px;">
                        <div style="font-size: 2rem; font-weight: bold;">${users.length}</div>
                        <div style="font-size: 0.9rem; opacity: 0.9;">Total Users</div>
                    </div>
                    <div style="background: #2ecc71; color: white; padding: 1rem; border-radius: 8px;">
                        <div style="font-size: 2rem; font-weight: bold;">${studentCount}</div>
                        <div style="font-size: 0.9rem; opacity: 0.9;">Students</div>
                    </div>
                    <div style="background: #e74c3c; color: white; padding: 1rem; border-radius: 8px;">
                        <div style="font-size: 2rem; font-weight: bold;">${crCount}</div>
                        <div style="font-size: 0.9rem; opacity: 0.9;">Class Representatives</div>
                    </div>
                </div>
            </div>
            ${tableHTML}
        `;
        
    } catch (error) {
        console.error('Error loading users:', error);
        usersList.innerHTML = `
            <div style="background: #fadbd8; padding: 1.5rem; border-radius: 10px; color: #e74c3c; border-left: 4px solid #e74c3c;">
                <h4 style="margin-bottom: 0.5rem;">❌ Error Loading Users</h4>
                <p style="margin: 0.5rem 0;"><strong>Error:</strong> ${error.message}</p>
                <p style="font-size: 0.9rem; margin-top: 1rem;">
                    <strong>Troubleshooting:</strong><br>
                    1. Check if backend is running<br>
                    2. Check Network tab for API errors<br>
                    3. Verify you're logged in as CR
                </p>
            </div>
        `;
    }
}

// Global function to remove user
window.removeUserAccount = async function(userId, userName, regNo) {
    const confirmed = confirm(
        `⚠️ REMOVE USER?\n\n` +
        `Name: ${userName}\n` +
        `Reg No: ${regNo}\n\n` +
        `This will DELETE:\n` +
        `• Their account\n` +
        `• All their marks\n` +
        `• All their data\n\n` +
        `They can re-register after removal.\n\n` +
        `Continue?`
    );
    
    if (!confirmed) return;
    
    try {
        console.log('Removing user:', userId);
        
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert(`✅ SUCCESS!\n\nUser "${userName}" has been removed.\nThey can now re-register with the same credentials.`);
            loadUsers(); // Reload the list
        } else {
            alert(`❌ Failed to remove user:\n${data.message}`);
        }
    } catch (error) {
        console.error('Error removing user:', error);
        alert(`❌ Error removing user:\n${error.message}`);
    }
};

