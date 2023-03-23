import { BASE_URL_MANAGER } from '../constant';
import request from '../request';

export const getManageAdmins = () => {
  return request.get<any>({
    url: `${BASE_URL_MANAGER}/admins`,
    data: {},
  });
};

export const getApplyList = (data: GetApplyList) => {
  return request.post<any>({
    url: `${BASE_URL_MANAGER}/apply/list`,
    data,
  });
};

