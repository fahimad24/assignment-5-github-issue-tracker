const issueCardsContainer = getEleById('issue-cards-container');
const filterBtnsContainer = getEleById('filter-btns-container');
const loadingSpinner = getEleById('loading-spinner');
let allIssues = [];

function showSpinner() {
  loadingSpinner.classList.remove('hidden');
  issueCardsContainer.classList.add('hidden');
}

function hideSpinner() {
  loadingSpinner.classList.add('hidden');
  issueCardsContainer.classList.remove('hidden');
}

const dataLoader = async () => {
  showSpinner();
  const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
  const data = await res.json();
  allIssues = data.data;
  issueCardsLoader('all', allIssues);
  hideSpinner();
}

async function searchIssue() {
  const searchInput = getEleById('search-input');
  const searchText = searchInput.value.trim().toLowerCase();

  if (!searchText) {
    console.log('Searching for:', searchText);
    dataLoader();
    return;
  }

  showSpinner();
  const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`);
  const data = await res.json();
  const filteredIssues = data.data;
  allIssues = filteredIssues;

  issueCardsLoader('all', filteredIssues);
  hideSpinner();
  searchInput.value = '';
}

dataLoader();

issueCardsContainer.addEventListener('click', async (e) => {
  e.stopPropagation();
  const issueCard = e.target.closest('.issue-card');
  if (!issueCard) return;
  const issueId = issueCard.getAttribute('set-data-id');

  const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${issueId}`);
  const data = await res.json();
  const issueDetails = data.data;

  openModal(issueDetails);


});


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

  if (data.length === 0) {
    issueCardsContainer.innerHTML = `
            <div class="text-center py-10 col-span-full">
                <h2 class="text-2xl font-bold mb-4">No issues found</h2>
                <p class="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
            </div>
        `;
    return;
  }

  data.forEach(issue => {
    issueCardsRender(issue);
  });

  // console.log(state, data);
}

function issueCardsRender(issue) {
  const { assignee, author, createdAt, description, id, labels, priority, status, title, updatedAt } = issue;


  issueCardsContainer.innerHTML += `
        <div set-data-id="${id}"
              class="border-t-4 rounded-md ${status === 'open' ? 'border-emerald-600' : 'border-purple-600'} bg-white shadow-sm issue-card"
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
                      class="px-2 p-[2px] rounded-full  text-xs border uppercase ${labels[0] === 'bug' ? 'text-red-500 border-red-300 bg-red-50' : labels[0] === 'enhancement' ? 'text-green-500 border-green-300 bg-green-50' : 'text-purple-500 border-purple-300 bg-purple-50'}"
                    >
                      <i class="${labels[0] === 'bug' ? 'fa-chisel fa-regular fa-bug ' : labels[0] === 'enhancement' ? 'fa-sharp fa-solid fa-stars' : 'fa-light fa-file-lines'}"></i>
                      ${labels[0]}
                    </button>
                    <button
                      class="px-2 py-[2px] rounded-full ${labels[1] ? '' : 'hidden'} bg-yellow-50 text-xs text-amber-600 border border-yellow-300 uppercase"
                    >
                      <i class="fa-sharp fa-light fa-circle-currency"></i>
                        ${labels[1]}
                    </button>
                  </div>
                </div>
              </div>
              <div class="p-5 text-gray-400 space-y-3">
                <p class="text-xs">#${id} by ${author.split('_').join(' ')}</p>
                <p class="text-xs">${new Date(updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
        `

}

function openModal(issue) {
  const modal = getEleById('my_modal');
  const issueDetails = `
    <div class="max-w-2xl w-full p-5 bg-white rounded-lg">
          <div>
            <div class="space-y-5">
              <h2 class="text-2xl font-bold">${issue.title}</h2>
              <div class="flex items-center gap-2 mt-2 text-gray-500 text-xs">
                <span class="py-1 p-2 rounded-full ${issue.status === 'open' ? 'bg-green-600' : 'bg-purple-600'} text-white"
                  >${issue.status === 'open' ? 'Opened' : 'Closed'}</span
                >•<span>Opened by ${issue.author.split('_').join(' ')}</span>•<span>${new Date(issue.updatedAt).toLocaleDateString()}</span>
              </div>
              <div class="flex items-center gap-3 my-4">
                <button
                  class="px-2 p-[1px] rounded-full text-xs border uppercase ${issue?.labels[0] === 'bug' ? 'text-red-500 border-red-300 bg-red-50' : issue?.labels[0] === 'enhancement' ? 'text-green-500 border-green-300 bg-green-50' : 'text-purple-500 border-purple-300 bg-purple-50'}"
                >
                  <i
                    class="${issue?.labels[0] === 'bug' ? 'fa-chisel fa-regular fa-bug ' : issue?.labels[0] === 'enhancement' ? 'fa-sharp fa-solid fa-stars' : 'fa-light fa-file-lines'}"
                  ></i>
                  ${issue?.labels[0]}
                </button>
                <button
                  class="px-2 py-[1px] rounded-full ${issue.labels[1] ? '' : 'hidden'} bg-yellow-50 text-xs text-amber-600 border border-yellow-300 uppercase"
                >
                  <i class="fa-sharp fa-light fa-circle-currency"></i>
                  ${issue?.labels[1]}
                </button>
              </div>
              <div class="my-5 text-neutral-500">
                <p>${issue?.description}</p>
              </div>
              <div
                class="flex items-center justify-between gap-5 p-2.5 bg-gray-50 rounded-lg"
              >
                <div class="flex-1 space-y-3">
                  <h3 class="font-medium text-neutral-500">Assignee:</h3>
                  <p>${issue?.assignee ? issue?.assignee.split('_').join(' ') : 'Unassigned'}</p>
                </div>
                <div class="flex-1 space-y-3">
                  <h3 class="font-medium text-neutral-500">Priority:</h3>
                  <span
                    class="py-1 px-3 rounded-full text-xs text-white ${issue.priority === 'high' ? ' bg-red-500 ' : issue.priority === 'medium' ? ' bg-amber-500 ' : ' bg-gray-500'} uppercase"
                    >${issue.priority}</span
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="modal-action">
            <form method="dialog">
              <!-- if there is a button in form, it will close the modal -->
              <button class="btn btn-primary">Close</button>
            </form>
          </div>
        </div>
    `
  modal.innerHTML = issueDetails;
  modal.showModal();
}


