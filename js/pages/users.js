import { userService } from '../api/user.service.js';

function createUserRow(user) {
  const statusBadge = user.estado 
    ? `<span class="badge bg-success">Activo</span>`
    : `<span class="badge bg-danger">Inactivo</span>`;

  const userId = user.id_usuario;

  return `
    <tr>
      <td class="px-0">
        <div class="d-flex align-items-center">
          <img src="./assets/images/profile/user-3.jpg" class="rounded-circle" width="40" alt="flexy" />
          <div class="ms-3">
            <h6 class="mb-0 fw-bolder">${user.nombre}</h6>
            <span class="text-muted">${user.documento}</span>
          </div>
        </div>
      </td>
      <td class="px-0">${user.email}</td>
      <td class="px-0">${user.telefono}</td>
      <td class="px-0">
        <div class="form-check form-switch ms-2 d-inline-block">
            <input class="form-check-input user-status-switch" type="checkbox" role="switch" 
                   id="switch-${userId}" data-user-id="${userId}" 
                   ${user.estado ? 'checked' : ''}>
            <label class="form-check-label" for="switch-${userId}">
              ${user.estado ? 'Activo' : 'Inactivo'}
            </label>
        </div>
      </td>
      <td class="px-0 text-dark fw-medium text-end">${user.nombre_rol}</td>
      <td class="px-0 text-end">
          <button class="btn btn-sm btn-info btn-edit-user" data-user-id="${userId}"><i class="fa-regular fa-pen-to-square"></i></button>
      </td>
    </tr>
  `;
}


// --- FUNCIÓN PRINCIPAL DE INICIALIZACIÓN ---

async function init() {
  const tableBody = document.getElementById('users-table-body');
  if (!tableBody) return;

  tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Cargando usuarios ... </td></tr>'; // ✅ CORRECCIÓN: colspan="6"

  try {
    const users = await userService.getUsers();
    if (users && users.length > 0) {
      tableBody.innerHTML = users.map(createUserRow).join('');
    } else {
      tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No se encontraron usuarios.</td></tr>'; // ✅ CORRECCIÓN: colspan="6"
    }
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Error al cargar los datos.</td></tr>`; // ✅ CORRECCIÓN: colspan="6"
  }

  // Aplicamos el patrón remove/add para evitar listeners duplicados
  const editForm = document.getElementById('edit-user-form');
  const createForm = document.getElementById('create-user-form');
  tableBody.removeEventListener('click', handleTableClick);
  tableBody.addEventListener('click', handleTableClick);
  tableBody.removeEventListener('change', handleStatusSwitch);
  tableBody.addEventListener('change', handleStatusSwitch);
  editForm.removeEventListener('submit', handleUpdateSubmit);
  editForm.addEventListener('submit', handleUpdateSubmit);
  createForm.removeEventListener('submit', handleCreateSubmit);
  createForm.addEventListener('submit', handleCreateSubmit);

}

export { init };