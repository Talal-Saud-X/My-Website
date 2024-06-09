const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            return;
        }
    });
});

const elements = document.querySelectorAll('.animation');

elements.forEach(el => observer.observe(el))