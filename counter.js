const firebaseConfig = {
    apiKey: "AIzaSyBxAtCqavGEIVv9nFBUIWS9k4xYgsnOI_8",
    authDomain: "miky-82a95.firebaseapp.com",
    databaseURL: "https://miky-82a95-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "miky-82a95",
    storageBucket: "miky-82a95.firebasestorage.app",
    messagingSenderId: "446183898793",
    appId: "1:446183898793:web:1ea81d2a278f3a431573b8"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const viewsRef = database.ref('views');
const COOLDOWN_HOURS = 8;
const COOLDOWN_MS = COOLDOWN_HOURS * 60 * 60 * 1000;
const STORAGE_KEY = 'lastViewTimestamp';
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function canAddView() {
    const lastView = localStorage.getItem(STORAGE_KEY);
    if (!lastView) return true;

    const timeSinceLastView = Date.now() - parseInt(lastView);
    return timeSinceLastView >= COOLDOWN_MS;
}
function updateLastViewTimestamp() {
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
}
function updateViewCount() {
    if (canAddView()) {
        viewsRef.transaction((currentViews) => {
            return (currentViews || 0) + 1;
        }, (error, committed, snapshot) => {
            if (error) {
                console.error('Error updating view count:', error);
            } else if (committed) {
                updateLastViewTimestamp();
                const viewCount = snapshot.val();
                document.getElementById('viewCount').textContent = formatNumber(viewCount);
            }
        });
    } else {
        viewsRef.once('value').then((snapshot) => {
            const viewCount = snapshot.val() || 0;
            document.getElementById('viewCount').textContent = formatNumber(viewCount);
        });
    }
}
viewsRef.on('value', (snapshot) => {
    const viewCount = snapshot.val() || 0;
    document.getElementById('viewCount').textContent = formatNumber(viewCount);
});
updateViewCount(); 