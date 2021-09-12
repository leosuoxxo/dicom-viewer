import api from './api';

const ERROR = {
  2001: '該驗證碼不存在',
  2002: '該驗證碼已過期',
  2003: '該驗證碼尚未啟用',
};

export const OrganizationRepository = {
  getById(organizationId) {
    return api.get(`/organization/${organizationId}`).then((res) => {
      return res.data.data;
    });
  },
  get({ name, page = 1, limit = 25 }) {
    return api
      .get(`/organization`, {
        params: { name, skip: (page - 1) * limit, limit },
      })
      .then((res) => {
        return res.data.data;
      });
  },
  update(organization) {
    return api
      .put(`/organization/${organization.id}`, organization)
      .then((res) => {
        const { data } = res;
        if (data.error) throw data.error.message;
        return data.data;
      });
  },
  create(organization) {
    return api.post(`/organization`, organization).then((res) => {
      const { data } = res;
      if (data.error) throw data.error.message;
      return data.data;
    });
  },
  renewCode(organizationId) {
    return api.post(`/organization/${organizationId}/code`).then((res) => {
      const { data } = res;
      if (data.error) throw ERROR[data.error.errorCode];
      return data.data;
    });
  },
  authenticateCode({ code }) {
    return api.get(`/organization/authenticate/${code}`).then((res) => {
      const { data } = res;
      if (data.error) throw ERROR[data.error.errorCode];
      return data.data;
    });
  },
};
