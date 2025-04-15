const sections = ['sidebar', 'content', 'tab2-content'];

function switchTab (id)
{
    const tabs = document.querySelectorAll('.tab');

    tabs.forEach(tab => tab.classList.remove('active'));

    document.querySelector(`[onclick*="${id}"]`).classList.add('active');

    sections.forEach(sectionId =>
    {
        const element = document.getElementById(sectionId);

        if (sectionId === id)
        {
            element.classList.add(`${sectionId}--visible`);
            element.classList.remove(`${sectionId}--invisible`);
        }
        else
        {
            if (id != "sidebar")
            {
                element.classList.remove(`${sectionId}--visible`);
                element.classList.add(`${sectionId}--invisible`);
            }
        }
    });
}

function runContentTab ()
{
    const tabs = document.querySelectorAll('.tab');
    const contentTab = document.getElementById("content-tab");
    tabs.forEach(tab => tab.classList.remove('active'));
    contentTab.classList.add('active');

    sections.forEach(sectionId =>
    {
        const element = document.getElementById(sectionId);

        if (sectionId === "content")
        {
            element.classList.add(`${sectionId}--visible`);
            element.classList.remove(`${sectionId}--invisible`);
        }
        else
        {
            element.classList.remove(`${sectionId}--visible`);
            element.classList.add(`${sectionId}--invisible`);
        }
    });
}


document.addEventListener('DOMContentLoaded', () =>
{
    document.getElementById("year").textContent = new Date().getFullYear();

    const timeElem = document.getElementById('published-time');

    if (timeElem)
    {
        const rawTime = timeElem.getAttribute('data-raw-time');
        const date = new Date(rawTime);

        const formatted = date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        timeElem.textContent = `${formatted}`;
    }
});

export
{
    switchTab,
    runContentTab
}