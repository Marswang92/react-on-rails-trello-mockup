import {
  LOAD_ALL_LISTS,
  LOAD_ALL_LISTS_SUCCEED,
  LOAD_ALL_LISTS_FAILED,
  CREATE_LIST,
  CREATE_LIST_SUCCEED,
  CREATE_LIST_FAILED,
  UPDATE_LIST,
  UPDATE_LIST_SUCCEED,
  UPDATE_LIST_FAILED,
  ARCHIVE_LIST,
  ARCHIVE_LIST_SUCCEED,
  ARCHIVE_LIST_FAILED,
} from '../constants/listConstants';

import {
  LOAD_BOARD_DETAIL,
  LOAD_BOARD_DETAIL_SUCCEED,
  LOAD_BOARD_DETAIL_FAILED,
} from '../constants/boardConstants';

import {
  UPDATE_TASK_SUCCEED,
  CREATE_TASK_SUCCEED,
  ARCHIVE_TASK_SUCCEED,
} from '../constants/taskConstants';

const ListReducer = (state = '', action) => {
  switch (action.type) {
    case LOAD_BOARD_DETAIL:
      return { ...state,
        isLoading: true,
        all: [],
      };
    case LOAD_BOARD_DETAIL_SUCCEED:
      return { ...state,
        isLoading: false,
        all: action.data.lists,
      };
    case LOAD_BOARD_DETAIL_FAILED:
      return { ...state,
        isLoading: false,
        all: [],
      };
    case CREATE_LIST:
      return { ...state,
        isCreating: true,
      };
    case CREATE_LIST_SUCCEED:
      const createdListAll = [...state.all];
      createdListAll.push(action.data.list);
      return { ...state,
        isCreating: false,
        all: createdListAll,
      };
    case CREATE_LIST_FAILED:
      return { ...state,
        isCreating: false,
        creatingError: action.data.error,
      };
    case UPDATE_LIST:
      return { ...state,
        isUpdating: true,
        updatingError: null,
      };
    case UPDATE_LIST_SUCCEED:
      const updatedListAll = [...state.all];
      for (let i = 0, len = updatedListAll.length; i < len; i+=1) {
        if (updatedListAll[i].id === action.data.list.id) {
          updatedListAll[i] = { ...action.data.list };
          break;
        }
      }
      return { ...state,
        isUpdating: false,
        all: updatedListAll,
      };
    case UPDATE_LIST_FAILED:
      return { ...state,
        isUpdating: false,
        updatingError: action.data.error,
      };
    case ARCHIVE_LIST:
      return { ...state,
        isArchiving: true,
        archivingError: null,
      };
    case ARCHIVE_LIST_SUCCEED:
      const archivedUpdatedListAll = [...state.all];
      for (let i = 0, len = archivedUpdatedListAll.length; i < len; i+=1) {
        if (archivedUpdatedListAll[i].id === action.data.archivedList.originalId) {
          archivedUpdatedListAll.splice(i, 1);
          break;
        }
      }
      return { ...state,
        isArchiving: false,
        all: archivedUpdatedListAll,
      };
    case ARCHIVE_LIST_FAILED:
      return { ...state,
        isArchiving: false,
        archivingError: action.data.error,
      };
    case CREATE_TASK_SUCCEED:
      const taskCreatedListAll = [...state.all];
      const listId= action.data.task.list_id;
      for (let i = 0, len = taskCreatedListAll.length; i < len; i+=1) {
        if (taskCreatedListAll[i].id === listId) {
          taskCreatedListAll[i].tasks.push({ ...action.data.task });
          break;
        }
      }
      return { ...state,
        isUpdating: false,
        all: taskCreatedListAll,
      };
    case UPDATE_TASK_SUCCEED:
      const taskUpdatedListAll = [...state.all];
      const belongedListId = action.data.task.belongsTo.id;
      const taskId = action.data.task.id;
      for (let i = 0, len = taskUpdatedListAll.length; i < len; i+=1) {
        if (taskUpdatedListAll[i].id === belongedListId) {
          for (let j = 0, tlen = taskUpdatedListAll[i].tasks.length; j < tlen; j+=1) {
            if (taskUpdatedListAll[i].tasks[j].id === taskId) {
              taskUpdatedListAll[i].tasks[j] = action.data.task;
              break;
            }
          }
          break;
        }
      }
      return { ...state,
        isUpdating: false,
        all: taskUpdatedListAll,
      };
    case ARCHIVE_TASK_SUCCEED:
      const taskArchivedListAll = [...state.all];
      const archivedBelongedListId = action.data.archivedTask.listId;
      const archivedTaskId = action.data.archivedTask.originalId;
      for (let i = 0, len = taskArchivedListAll.length; i < len; i+=1) {
        if (taskArchivedListAll[i].id === archivedBelongedListId) {
          for (let j = 0, tlen = taskArchivedListAll[i].tasks.length; j < tlen; j+=1) {
            if (taskArchivedListAll[i].tasks[j].id === archivedTaskId) {
              taskArchivedListAll[i].tasks.splice(j, 1);
              break;
            }
          }
          break;
        }
      }
      return { ...state,
        isUpdating: false,
        all: taskArchivedListAll,
      };
    default:
      return state;
  }
};

export default ListReducer;
