import { useEffect, useState } from 'react';
import axios from 'axios';
import Mpty from './assets/images/npty.webp'
import './App.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [posts, setPosts] = useState(null);
  const [reload, setReload] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:3001/post')
      .then((res) => setPosts(res.data))
      .catch((err) => console.error('Error fetching posts:', err));
  }, [reload]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const file = formData.get('image');
    let base64Image = '';
    if (file) {
      base64Image = await convertToBase64(file);
    }

    const post = {
      title: formData.get('title'),
      desc: formData.get('desc'),
      image: base64Image,
    };

    axios
      .post('http://localhost:3001/post', post)
      .then(() => {
        e.target.reset();
        setReload((prev) => !prev);
      })
      .catch((err) => console.error('Error creating post:', err));
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3001/post/${id}`)
      .then(() => setReload((prev) => !prev))
      .catch((err) => console.error('Error deleting post:', err));
      toast.error("Usr ltc")
  };

  const openEditModal = (post) => {
    setCurrentPost(post);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentPost(null);
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    let base64Image = currentPost.image;
    const file = formData.get('image');
    if (file && file.size > 0) {
      base64Image = await convertToBase64(file);
    }

    const updatedPost = {
      title: formData.get('title'),
      desc: formData.get('desc'),
      image: base64Image,
    };

    axios
      .put(`http://localhost:3001/post/${currentPost.id}`, updatedPost)
      .then(() => {
        closeModal();
        setReload((prev) => !prev);
      })
      .catch((err) => console.error('Error updating post:', err));
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <>
    <ToastContainer/>
      <h2 className='text-center mt-[50px] mb-[30px] text-[40px]'>CRUD</h2>
      <form className='flex justify-center items-center gap-[20px] mb-[50px]' onSubmit={handleCreatePost}>
        <input className='bg-blue-500 rounded-lg placeholder:text-white  py-[10px] px-[15px]' type="text" name="title" required placeholder="Name" />
        <input className='bg-blue-400 rounded-lg placeholder:text-white py-[10px] px-[15px]' type="number" name="desc" required placeholder="Age" />
        <input className='w-[130px]' type="file" name="image" accept="image/*" />
        <button className='bg-green-500 p-3 rounded-lg text-white'>Create</button>
      </form>
      {posts?.length > 0 ? (
        posts.map((post) => (
          <div className='border-[2px] p-[20px] flex flex-col justify-center w-[350px] mx-auto items-center mb-[20px]' key={post.id}>
            {post.image && <img className='rounded-lg h-[250px] w-[250px]' src={post.image} alt={post.title} />}
            <h3 className='text-[20px] font-bold'><strong>Name: </strong>{post.title}</h3>
            <p className='text-[20px] font-bold'><strong>Age: </strong> {post.desc}</p>
            <div className='flex gap-4 mt-[20px]'>
              <button className='bg-green-500 p-3 rounded-lg text-white' onClick={() => openEditModal(post)}>Update</button>
              <button className='bg-red-500 p-3 rounded-lg text-white' onClick={() => handleDelete(post.id)}>Delete</button>
            </div>
            <hr />
          </div>
        ))
      ) : (
        <img className='mx-auto' src={Mpty} alt='mpty img'/>
      )}

      {modalIsOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className='mb-[30px]'>Edit Post</h2>
            {currentPost && (
              <form onSubmit={handleUpdatePost}>
                <div className='flex flex-col justify-center items-center'>
                  <input
                    className='bg-blue-500 rounded-lg mb-[20px] placeholder:text-white text-white py-[10px] px-[15px]'
                    type="text"
                    name="title"
                    defaultValue={currentPost.title}
                    required
                  />
                  <input
                    className='bg-blue-500 mb-[20px] rounded-lg placeholder:text-white text-white py-[10px] px-[15px]'
                    type="number"
                    name="desc"
                    defaultValue={currentPost.desc}
                    required
                  />
                  <input type="file" className='mb-[20px] w-[130px]' name="image" accept="image/*" />
                </div>
                <div className='flex justify-center items-center gap-3'>
                  <button className='bg-green-500 p-3 rounded-lg text-white' type="submit">Save</button>
                  <button className='bg-red-500 p-3 rounded-lg text-white' type="button" onClick={closeModal}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
