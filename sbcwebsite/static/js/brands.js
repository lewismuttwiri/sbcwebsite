let currentIndex = 0;

function scrollBrands(direction) {
    const track = document.getElementById('brandsTrack');
    const cards = track.querySelectorAll('.brand-card');
    const cardWidth = cards[0].offsetWidth + 40; // 360px + 40px gap
    const visibleCards = 2;
    const maxIndex = cards.length - visibleCards;

    currentIndex += direction;

    if (currentIndex < 0) {
        currentIndex = maxIndex;
    } else if (currentIndex > maxIndex) {
        currentIndex = 0;
    }

    track.scrollTo({
        left: currentIndex * cardWidth,
        behavior: 'smooth'
    });
}
