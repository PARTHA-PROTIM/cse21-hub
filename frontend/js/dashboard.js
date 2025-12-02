checkAuth();

document.addEventListener('DOMContentLoaded', async () => {
    const user = getUser();
    const token = getToken();
    
    document.getElementById('userName').textContent = user.name;
    
    // Load dashboard data
    try {
        // Load courses
        const coursesRes = await fetch(`${API_URL}/courses`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const courses = await coursesRes.json();
        document.getElementById('courseCount').textContent = `${courses.length} courses enrolled`;
        
        // Load marks
        const marksRes = await fetch(`${API_URL}/marks/my-marks`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const marks = await marksRes.json();
        const avgMarks = marks.length > 0 
            ? (marks.reduce((sum, m) => sum + m.totalMarks, 0) / marks.length).toFixed(2)
            : 'N/A';
        document.getElementById('performanceInfo').textContent = `Average: ${avgMarks}`;
        
        // Load bus schedule
        const busRes = await fetch(`${API_URL}/bus`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const busSchedules = await busRes.json();
        if (busSchedules.length > 0) {
            document.getElementById('busInfo').textContent = 
                `${busSchedules[0].routeName} at ${busSchedules[0].departureTime}`;
        } else {
            document.getElementById('busInfo').textContent = 'No schedules available';
        }
        
        // Load contests
        const contestsRes = await fetch(`${API_URL}/contests`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const contests = await contestsRes.json();
        const upcomingContests = contests.filter(c => new Date(c.startTime) > new Date());
        document.getElementById('contestInfo').textContent = 
            upcomingContests.length > 0 
                ? `${upcomingContests[0].title} on ${new Date(upcomingContests[0].startTime).toLocaleDateString()}`
                : 'No upcoming contests';
        
        // Load news
        const newsRes = await fetch(`${API_URL}/news`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const news = await newsRes.json();
        const newsList = document.getElementById('newsList');
        
        if (news.length > 0) {
            newsList.innerHTML = news.slice(0, 5).map(n => `
                <div class="news-item">
                    <h4>${n.title}</h4>
                    <p>${n.content.substring(0, 100)}...</p>
                    <small>${new Date(n.createdAt).toLocaleDateString()}</small>
                </div>
            `).join('');
        } else {
            newsList.innerHTML = '<p>No news available</p>';
        }
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
});