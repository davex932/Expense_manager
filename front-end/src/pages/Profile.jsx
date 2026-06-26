import React from 'react';
import { User, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {

  const [status, setStatus] = React.useState({
    username: 'davex932',
    email: 'davex932@example.com',
  })

  const [passwordStatus, setPasswordStatus] = React.useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  })

  const handlePasswordChange= (e)=>{
    const {name, value} = e.target;
    setPasswordStatus({
      ...passwordStatus,
      [name]: value
    })
  }

  const handleChange= (e)=>{
    const {name, value} = e.target;
    setStatus({
      ...status,
      [name]: value
    })
  }

  const refreshAccessToken= async()=>{
    const refresh= localStorage.getItem('refresh');
    const refreshResponse= await fetch("http://127.0.0.1:8000/auth/jwt/refresh/",{
      method: 'POST',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        refresh: refresh
      })
    })
    const data= await refreshResponse.json();
    localStorage.setItem("token", data.access)

    return data.access
  }

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    try {
          
          let access= localStorage.getItem('token');
          const verification= await fetch("http://127.0.0.1:8000/auth/jwt/verify/",{
            method: 'POST',
            headers:{
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              token: access
            })
          })
          const verificationData= await verification.json();
          if(verificationData.status != 200){
            access= await refreshAccessToken()
            localStorage.setItem("token", access)
          } 

          const UpdateResponse = await fetch("http://127.0.0.1:8000/auth/users/me/", {
            method: 'PATCH',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              username: status.username,
              email: status.email
            })
          })

        if (UpdateResponse.ok) {
          const UpdateData = await UpdateResponse.json();
          toast.success("Profil mis à jour avec succès !");
        } else {
          toast.error("Échec de la mise à jour du profil");
        }
    } catch (err) {
      toast.error("Erreur lors de la mise à jour du profil");
      console.error("Erreur:", err);
    }
  };

  const handleSubmitPassword= async (e) =>{
    e.preventDefault();
    try{
      let access= localStorage.getItem('token');
      const verification= await fetch("http://127.0.0.1:8000/auth/jwt/verify/",{
        method: 'POST',
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: access
        })
      })
      const verificationData= await verification.json();
      if(verificationData.status != 200){
        access= await refreshAccessToken()
        localStorage.setItem("token", access)
      }
      if(passwordStatus.newPassword != passwordStatus.confirmNewPassword){
        toast.error("Les mots de passe ne correspondent pas");
      }else{
        const UpdateResponsePassword = await fetch("http://127.0.0.1:8000/auth/users/set_password/", {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            current_password: passwordStatus.currentPassword,
            new_password: passwordStatus.newPassword,
          })
        });

        if (UpdateResponsePassword.ok) {
          const UpdateDataPassword = await UpdateResponsePassword.json();
          toast.success("Mot de passe mis à jour avec succès !");
          setPasswordStatus({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        } else {
          toast.error("Échec de la mise à jour du mot de passe");
        }
      }
    }catch(err){
      toast.error("Erreur lors de la mise à jour du mot de passe");
      console.error("Erreur:", err);
    }

  };

  return (
    <div className="font-sans max-w-[680px] pb-10">
      <div className="mb-7">
        <h2 className="text-[26px] font-bold text-slate-800 font-display mb-1">Paramètres du profil</h2>
        <p className="text-[13px] text-slate-500">Gérez les informations de votre compte</p>
      </div>

      {/* Profile Information */}
      <div className="bg-white border border-slate-100 rounded-[20px] p-7 mb-6 shadow-sm hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-shadow duration-300">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <User size={22} />
          </div>
          <div>
            <p className="text-[16px] font-bold text-slate-800 m-0">Informations du Profil</p>
            <p className="text-[13px] font-medium text-slate-400 m-0 leading-tight mt-0.5">Mettez à jour les détails de votre compte</p>
          </div>
        </div>
        <form onSubmit={handleSubmitUpdate}>
          <div className="mb-4">
            <label className="block text-[13px] font-bold text-slate-700 mb-2">Nom d'utilisateur</label>
            <input 
              className="w-full px-3.5 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-[14px] font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all" 
              name="username" 
              value={status.username} 
              onChange={handleChange}
            />
          </div>
          <div className="mb-5">
            <label className="block text-[13px] font-bold text-slate-700 mb-2">Email</label>
            <input 
              className="w-full px-3.5 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-[14px] font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all" 
              name="email" 
              value={status.email} 
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-[14px] font-bold shadow-[0_4px_12px_rgba(37,99,235,0.2)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 transition-all outline-none">
            Mettre à jour le profil
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white border border-slate-100 rounded-[20px] p-7 shadow-sm hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-shadow duration-300">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Lock size={22} />
          </div>
          <div>
            <p className="text-[16px] font-bold text-slate-800 m-0">Changer de mot de passe</p>
            <p className="text-[13px] font-medium text-slate-400 m-0 leading-tight mt-0.5">Mettez à jour votre mot de passe pour sécuriser votre compte</p>
          </div>
        </div>
        <form onSubmit={handleSubmitPassword}>
          <div className="mb-4">
            <label className="block text-[13px] font-bold text-slate-700 mb-2">Mot de passe actuel</label>
            <input 
              type="password" 
              className="w-full px-3.5 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-[14px] font-semibold text-slate-800 outline-none focus:border-purple-500 focus:bg-white transition-all" 
              onChange={handlePasswordChange} 
              name='currentPassword' 
              value={passwordStatus.currentPassword} 
            />
          </div>
          <div className="mb-4">
            <label className="block text-[13px] font-bold text-slate-700 mb-2">Nouveau mot de passe</label>
            <input 
              type="password" 
              className="w-full px-3.5 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-[14px] font-semibold text-slate-800 outline-none focus:border-purple-500 focus:bg-white transition-all" 
              onChange={handlePasswordChange} 
              name='newPassword' 
              value={passwordStatus.newPassword} 
            />
          </div>
          <div className="mb-5">
            <label className="block text-[13px] font-bold text-slate-700 mb-2">Confirmer le nouveau mot de passe</label>
            <input 
              type="password" 
              className="w-full px-3.5 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-[14px] font-semibold text-slate-800 outline-none focus:border-purple-500 focus:bg-white transition-all" 
              onChange={handlePasswordChange} 
              name='confirmNewPassword' 
              value={passwordStatus.confirmNewPassword} 
            />
          </div>
          <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl text-[14px] font-bold shadow-[0_4px_12px_rgba(168,85,247,0.2)] hover:shadow-[0_6px_16px_rgba(168,85,247,0.3)] hover:-translate-y-0.5 transition-all outline-none">
            Changer le mot de passe
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;

