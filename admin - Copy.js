// Admin Panel logic with SQLite database via REST API
(function(){
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const API_BASE = '/api/entries';
  let entries = [];
  let editId = null;

  // Elements
  const form = document.getElementById('add-form');
  const nameEl = document.getElementById('name');
  const emailEl = document.getElementById('email');
  const roleEl = document.getElementById('role');
  const searchEl = document.getElementById('search');
  const clearAllBtn = document.getElementById('clear-all');

  const tbody = document.getElementById('entries-body');
  const emptyState = document.getElementById('empty-state');

  const modal = document.getElementById('modal');
  const modalCloseBtns = document.querySelectorAll('[data-modal-close]');
  const editForm = document.getElementById('edit-form');
  const editName = document.getElementById('edit-name');
  const editEmail = document.getElementById('edit-email');
  const editRole = document.getElementById('edit-role');

  // API helpers
  async function fetchEntries(search=''){
    try{
      const url = search ? `${API_BASE}?search=${encodeURIComponent(search)}` : API_BASE;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch entries');
      entries = await res.json();
      render();
    }catch(e){
      console.error('Fetch error:', e);
      alert('Failed to load entries. Make sure the server is running.');
    }
  }

  async function createEntry(entry){
    try{
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(entry)
      });
      if (!res.ok) throw new Error('Failed to create entry');
      await fetchEntries(searchEl.value);
    }catch(e){
      console.error('Create error:', e);
      alert('Failed to add entry');
    }
  }

  async function updateEntry(id, data){
    try{
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update entry');
      await fetchEntries(searchEl.value);
    }catch(e){
      console.error('Update error:', e);
      alert('Failed to update entry');
    }
  }

  async function deleteEntry(id){
    try{
      const res = await fetch(`${API_BASE}/${id}`, {method: 'DELETE'});
      if (!res.ok) throw new Error('Failed to delete entry');
      await fetchEntries(searchEl.value);
    }catch(e){
      console.error('Delete error:', e);
      alert('Failed to delete entry');
    }
  }

  async function deleteAllEntries(){
    try{
      const res = await fetch(API_BASE, {method: 'DELETE'});
      if (!res.ok) throw new Error('Failed to clear entries');
      await fetchEntries(searchEl.value);
    }catch(e){
      console.error('Clear all error:', e);
      alert('Failed to clear entries');
    }
  }

  function uid(){
    return 'id-' + Math.random().toString(36).slice(2,9) + Date.now().toString(36);
  }

  function render(){
    tbody.innerHTML = '';
    if (entries.length === 0){
      emptyState.hidden = false;
      return;
    }
    emptyState.hidden = true;

    for (const e of entries){
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHtml(e.name)}</td>
        <td>${escapeHtml(e.email)}</td>
        <td>${escapeHtml(e.role)}</td>
        <td class="actions-col">
          <div class="row-actions">
            <button class="btn ghost" data-edit="${e.id}">Edit</button>
            <button class="btn danger" data-delete="${e.id}">Delete</button>
          </div>
        </td>`;
      tbody.appendChild(tr);
    }
  }

  function escapeHtml(str){
    return str.replace(/[&<>"]+/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]));
  }

  function openModal(){
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
  }
  function closeModal(){
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden','true');
    editId = null;
    editForm.reset();
  }

  // Handlers
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const entry = {
      id: uid(),
      name: nameEl.value.trim(),
      email: emailEl.value.trim(),
      role: roleEl.value.trim(),
      createdAt: Date.now()
    };
    if (!entry.name || !entry.email || !entry.role) return;
    await createEntry(entry);
    form.reset();
  });

  tbody.addEventListener('click', (e)=>{
    const editBtn = e.target.closest('[data-edit]');
    const delBtn = e.target.closest('[data-delete]');
    if (editBtn){
      const id = editBtn.getAttribute('data-edit');
      const item = entries.find(x=>x.id===id);
      if (!item) return;
      editId = id;
      editName.value = item.name;
      editEmail.value = item.email;
      editRole.value = item.role;
      openModal();
    } else if (delBtn){
      const id = delBtn.getAttribute('data-delete');
      deleteEntry(id);
    }
  });

  editForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    if (!editId) return;
    const data = {
      name: editName.value.trim(),
      email: editEmail.value.trim(),
      role: editRole.value.trim()
    };
    await updateEntry(editId, data);
    closeModal();
  });

  modalCloseBtns.forEach(btn=>btn.addEventListener('click', closeModal));
  modal.addEventListener('click', (e)=>{
    if (e.target.matches('.modal-backdrop')) closeModal();
  });
  window.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape') closeModal();
  });

  // Debounced search
  let searchTimeout;
  searchEl.addEventListener('input', (e)=>{
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(()=>{
      fetchEntries(e.target.value);
    }, 300);
  });

  clearAllBtn.addEventListener('click', async ()=>{
    if (!entries.length) return;
    if (confirm('Clear all entries?')){
      await deleteAllEntries();
    }
  });

  // Init
  fetchEntries('');
})();
