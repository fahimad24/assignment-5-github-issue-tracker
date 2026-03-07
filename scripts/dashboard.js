const issueCardsContainer = getEleById('issue-cards-container');
const filterBtnsContainer = getEleById('filter-btns-container');
let allIssues = [];

const dataLoader = async () => {
    const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
    const data = await res.json();
    allIssues = data.data;
    issueCardsLoader('all', allIssues);
}

async function searchIssue() {
    const searchInput = getEleById('search-input');
    const searchText = searchInput.value.trim().toLowerCase();

    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`);
    const data = await res.json();
    const filteredIssues = data.data;
    allIssues = filteredIssues;

    issueCardsLoader('all', filteredIssues);
}

dataLoader();


filterBtnsContainer.addEventListener('click', (e) => {
    const clickedBtn = e.target.closest('button');
    if (!clickedBtn || !filterBtnsContainer.contains(clickedBtn)) return;

    const state = clickedBtn.innerText.trim().toLowerCase();
    issueCardsLoader(state, allIssues);

});



function issueCardsLoader(state = 'all', data) {

    const issuesLength = getEleById('issuses-langth');

    issueCardsContainer.innerHTML = '';

    if (state === 'open') {
        data = data.filter(issue => issue.status === 'open');
    } else if (state === 'closed') {
        data = data.filter(issue => issue.status === 'closed');
    }

    const filterButtons = filterBtnsContainer.querySelectorAll('button');
    filterButtons.forEach((button) => {
        if (button.innerText.trim().toLowerCase() === state) {
            button.classList.add('btn-active', 'btn-primary');
        } else {
            button.classList.remove('btn-active', 'btn-primary');
        }
    });

    issuesLength.innerText = data.length;

    data.forEach(issue => {
        issueCardsRender(issue);
    });

    // console.log(state, data);
}

function issueCardsRender(issue) {
    const { assignee, author, createdAt, description, id, labels, priority, status, title, updatedAt } = issue;

    issueCardsContainer.innerHTML += `
        <div
              class="border-t-4 rounded-md ${status === 'open' ? 'border-emerald-600' : 'border-purple-600'} bg-white shadow-sm"
            >
              <div class="border-b-2 p-5 border-gray-300">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3 py-1">
                    <img
                      src="./assets/${status === 'open' ? 'Open-Status.png' : 'close.png'}"
                      alt="${status === 'open' ? 'Open Status' : 'Closed Status'}"
                      class="w-6 h-6 rounded-full"
                    />
                  </div>
                  <div>
                    <span
                      class="py-1 px-5 rounded-full text-xs ${priority === 'high' ? "text-red-500 bg-red-50 " : priority === 'medium' ? "text-amber-500 bg-amber-50 " : "text-gray-500 bg-gray-50"}  uppercase"
                      >${priority}</span
                    >
                  </div>
                </div>
                <div class="mt-2 space-y-2">
                  <h2 class="text-sm font-bold">${title}</h2>
                  <p class="text-gray-500 text-xs mt-1">
                    ${description}
                  </p>
                  <div class="flex items-center gap-3">
                    <button
                      class="px-2 p-[1px] rounded-full  text-xs border uppercase ${issue?.labels[0] === 'bug' ? 'text-red-500 border-red-500 bg-red-50' : issue?.labels[0] === 'enhancement' ? 'text-green-500 border-green-500 bg-green-50' : 'text-purple-500 border-purple-500 bg-purple-50'}"
                    >
                      <i class="${issue?.labels[0] === 'bug' ? 'fa-chisel fa-regular fa-bug ' : issue?.labels[0] === 'enhancement' ? 'fa-sharp fa-solid fa-stars' : 'fa-light fa-file-lines'}"></i>
                      ${issue?.labels[0]}
                    </button>
                    <button
                      class="px-2 py-[1px] rounded-full bg-yellow-50 text-xs text-amber-600 border border-yellow-500 uppercase"
                    >
                      <i class="fa-sharp fa-light fa-circle-currency"></i>
                        ${issue?.labels[1]}
                    </button>
                  </div>
                </div>
              </div>
              <div class="p-5 text-gray-400 space-y-3">
                <p class="text-xs">#${id} by ${author}</p>
                <p class="text-xs">${new Date(createdAt).toLocaleDateString()}</p>
              </div>
            </div>
        `

}