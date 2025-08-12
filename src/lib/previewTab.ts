document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.tabLayoutButton').forEach((btn) => {
        const button = btn as HTMLButtonElement;
        button.addEventListener('click', () => {
            let layout = document.querySelector(`.tabLayout#${button.dataset.tabLayout}`) as HTMLDivElement;
            if (!layout) return;
            document.querySelectorAll('.tabLayout.active').forEach(el => {
                (el as HTMLDivElement).style.display = 'none';
                (el as HTMLDivElement).classList.remove('active');
            });
            document.querySelectorAll('.tabLayoutButton').forEach(el => {
                (el as HTMLButtonElement).classList.remove('active');
            });
            layout.style.display = layout.dataset.display ?? 'block';
            layout.classList.add('active');
            btn.classList.add('active');
        })
    })
})