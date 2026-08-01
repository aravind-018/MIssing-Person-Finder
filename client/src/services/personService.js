import api from "./api";

export const getAllPersons = async () => {
    const response = await api.get("/person");
    return response.data;
};

export const registerPerson = (data) =>
  api.post("/person/register", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updatePerson = (id, data) =>
  api.put(`/person/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deletePerson = (id) =>
    api.delete(`/person/${id}`);

export const updatePersonStatus = async (id, status) => {
    const { data } = await api.put(`/person/${id}/status`, { status });
    return data;
};
