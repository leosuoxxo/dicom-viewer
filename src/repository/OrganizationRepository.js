import api from './api';

export const OrganizationRepository = {
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
};
