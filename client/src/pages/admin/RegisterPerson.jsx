import { useState, useEffect } from "react";
import "../../styles/RegisterPerson.css";
import { useLocation, useNavigate } from "react-router-dom";
import {
  registerPerson,
  updatePerson,
} from "../../services/personService";
import { useParams } from "react-router-dom";
import { getPersonById } from "../../services/api";
import useConfirmModal from "../../hooks/useConfirmModal";
import ConfirmModal from "../../components/common/ConfirmModal";
import {
  showSuccess,
  showError,
} from "../../utils/toast";

function RegisterPerson() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [editingPerson, setEditingPerson] = useState(location.state || null);

const [formData, setFormData] = useState({
  name: "",
  age: "",
  gender: "",
  address: "",
  contact: "",
  missingSince: "",
  lastSeen: "",
  clothing: "",
  notes: "",
});

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const {
  confirmModal,
  openConfirmModal,
  closeConfirmModal,
} = useConfirmModal();

useEffect(() => {
  if (!editingPerson) return;

setFormData({
  name: editingPerson.name || "",
  age: editingPerson.age || "",
  gender: editingPerson.gender || "",
  address: editingPerson.address || "",
  contact: editingPerson.contact || "",
  missingSince: editingPerson.missingSince?.split("T")[0] || "",
 lastSeen: editingPerson.lastSeen || "",
  clothing: editingPerson.clothing || "",
  notes: editingPerson.notes || "",
});


}, [editingPerson]);

useEffect(() => {
  if (!id || editingPerson) return;

  const fetchPerson = async () => {
    try {
      const response = await getPersonById(id);

      setEditingPerson(response.data);
    } catch (error) {
      console.error(error);
      showError("Failed to load person details.");
    }
  };

  fetchPerson();
}, [id, editingPerson]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {

  const selectedImages = Array.from(e.target.files);

  if (selectedImages.length > 5) {
    showError("You can upload a maximum of 5 images.");
    return;
  }

  setImages(selectedImages);

  const previews = selectedImages.map((image) =>
    URL.createObjectURL(image)
  );

  setImagePreviews(previews);
};

const removeImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);

    const updatedPreviews = [...imagePreviews];
    updatedPreviews.splice(index, 1);
    setImagePreviews(updatedPreviews);
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const data = new FormData();

// Add text fields
data.append("name", formData.name);
data.append("age", formData.age);
data.append("gender", formData.gender);
data.append("address", formData.address);
data.append("contact", formData.contact);
data.append("missingSince", formData.missingSince);

// Add optional fields if you have them
data.append("lastSeen", formData.lastSeen);
data.append("clothing", formData.clothing || "");
data.append("notes", formData.notes || "");


// Add all selected images
images.forEach((image) => {
  data.append("images", image);
});

if (editingPerson) {
  openConfirmModal({
    title: "Update Missing Person",
    message: "Are you sure you want to save these changes?",
    confirmText: "Update",
    confirmClass: "confirm-approve",

    onConfirm: async () => {
      try {
        await updatePerson(editingPerson._id, data);

        showSuccess("Person updated successfully.");

        closeConfirmModal();

        navigate("/admin/manage-persons");
      } catch (error) {
        console.error(error);

        showError("Update failed.");

        closeConfirmModal();
      }
    },
  });

  return;
}else {
  openConfirmModal({
    title: "Register Missing Person",
    message: "Are you sure you want to register this missing person?",
    confirmText: "Register",
    confirmClass: "confirm-approve",

    onConfirm: async () => {
      try {
        await registerPerson(data);

        showSuccess("Person registered successfully.");

        closeConfirmModal();

       navigate("/admin/manage-persons");;
      } catch (error) {
        console.error(error);

        showError(error.response?.data?.message || "Registration failed.");

        closeConfirmModal();
      }
    },
  });

  return;

}

} catch (error) {
  console.error(error);

  showError(
    editingPerson
      ? "Update failed."
      : "Registration failed."
  );
}
};

console.log(images);

return (
    <div className="page">
      

      <div className="content">

<form className="form-card" onSubmit={handleSubmit}>



    <div className="form-header">
        <h2  className="page-title" >
    {editingPerson ? "Edit Missing Person" : "Register Missing Person"}
</h2>

<p>
    {editingPerson
        ? "Update the missing person's information."
        : "Enter all available information about the missing individual."}
</p>
    </div>


    <div className="form-grid">

                <h2 className="section-title">
    👤 Personal Information
</h2>

        <div className="form-group full-width">



            <label>Name</label>

            <input

              type="text"

              name="name"

              value={formData.name}

              onChange={handleChange}

              placeholder="Name"

              required

            />

          </div>



          <div className="form-group">

            <label>Age</label>

            <input

              type="number"

              name="age"

              value={formData.age}

              onChange={handleChange}

              placeholder="Age"

              required

            />

          </div>



          <div className="form-group">

            <label>Gender</label>



            <select

              name="gender"

              value={formData.gender}

              onChange={handleChange}

              required

            >

              <option value="">Select Gender</option>

              <option value="Male">Male</option>

              <option value="Female">Female</option>

              <option value="Other">Other</option>

            </select>

          </div>



          <div className="form-group full-width">

            <label>Address</label>



            <textarea

              rows="4"

              name="address"

              value={formData.address}

              onChange={handleChange}

              placeholder="Address"

              required

            />

          </div>



          <div className="form-group">

            <label>Contact Number</label>



            <input

              type="text"

              name="contact"

              value={formData.contact}

              onChange={handleChange}

              placeholder="Contact Number"

              required

            />

          </div>

            <h2 className="section-title">
    📍 Missing Information
</h2>

         <div className="form-group">
  <label>Last Seen Location</label>

  <input
    type="text"
    name="lastSeen"
    value={formData.lastSeen}
    onChange={handleChange}
    placeholder="Example: Kollam Railway Station"
  />
</div>

<div className="form-group">
  <label>Missing Since</label>
  <input
    type="date"
    name="missingSince"
    value={formData.missingSince}
    onChange={handleChange}
    required
  />
</div>



<div className="form-group full-width">

  <label>Clothing Description</label>



  <textarea

    rows="3"

    name="clothing"

    value={formData.clothing}

    onChange={handleChange}

    placeholder="Example: Blue T-shirt, Black Jeans"

  />

</div>



<div className="form-group full-width">

  <label>Additional Notes</label>



  <textarea

    rows="4"

    name="notes"

    value={formData.notes}

    onChange={handleChange}

    placeholder="Any identifying marks, medical conditions, etc."

  />

</div>

            <h2 className="section-title">
    📷 Images
</h2>

          <div className="form-group full-width">

  <label>Upload Images</label>

  <label htmlFor="image-upload" className="upload-box">

      <div className="upload-icon">📷</div>

      <h3>Drag & Drop Images</h3>

      <p>or click to browse</p>

      <span>Maximum 5 Images</span>

  </label>

  <input
      id="image-upload"
      type="file"
      multiple
      accept="image/*"
      onChange={handleImageChange}
      hidden
  />

  {imagePreviews.length > 0 && (
    <>
        <p className="image-count">
            {imagePreviews.length} / 5 Images Selected
        </p>

        <div className="preview-grid">

            {imagePreviews.map((image, index) => (

                <div className="preview-card" key={index}>

                    <img
                        src={image}
                        alt={`Preview ${index}`}
                        className="preview-image"
                    />

                    <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => removeImage(index)}
                    >
                        ✕
                    </button>

                </div>

            ))}

        </div>
    </>
)}

</div>



         <div className="button-group">

    <button
        type="button"
        className="cancel-btn"
        onClick={() => navigate(-1)}
    >
        Cancel
    </button>

    <button
        type="submit"
        className="submit-btn"
    >
        {editingPerson ? "Update Person" : "Register Person"}
    </button>

</div>

    </div>

</form>
      </div>
      <ConfirmModal
  isOpen={confirmModal.isOpen}
  title={confirmModal.title}
  message={confirmModal.message}
  confirmText={confirmModal.confirmText}
  confirmClass={confirmModal.confirmClass}
  onCancel={closeConfirmModal}
  onConfirm={confirmModal.onConfirm}
/>
    </div>
  );
}

export default RegisterPerson;
