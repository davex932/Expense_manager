import React from 'react';
import { User, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const s = {
    page: { fontFamily: "'Inter', system-ui, sans-serif", maxWidth: '680px' },
    header: { marginBottom: '28px' },
    title: { fontSize: '26px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0', fontFamily: "'Outfit', sans-serif" },
    subtitle: { fontSize: '13px', color: '#64748b', margin: 0 },
    card: {
      background: '#ffffff', border: '1px solid #e2e8f0',
      borderRadius: '14px', padding: '28px', marginBottom: '20px',
    },
    cardHeaderRow: {
      display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px',
    },
    iconBox: (bg, color) => ({
      width: '44px', height: '44px', borderRadius: '50%',
      background: bg, display: 'flex', alignItems: 'center',
      justifyContent: 'center', color, flexShrink: 0,
    }),
    cardTitle: { fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: '0 0 2px 0' },
    cardSub: { fontSize: '12px', color: '#64748b', margin: 0 },
    fieldLabel: {
      display: 'block', fontSize: '13px', fontWeight: '500',
      color: '#475569', marginBottom: '6px',
    },
    input: {
      width: '100%', padding: '11px 14px',
      background: '#f1f3f9', border: '1.5px solid #f1f3f9',
      borderRadius: '10px', fontSize: '13px', color: '#1e293b',
      outline: 'none', boxSizing: 'border-box', marginBottom: '16px',
    },
    btnPrimary: {
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      padding: '10px 20px',
      background: 'linear-gradient(90deg, #5b7af9 0%, #2563eb 100%)',
      color: '#fff', border: 'none', borderRadius: '10px',
      fontSize: '13px', fontWeight: '600', cursor: 'pointer',
    },
    btnSecondary: {
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      padding: '10px 20px',
      background: 'linear-gradient(90deg, #a855f7 0%, #9333ea 100%)',
      color: '#fff', border: 'none', borderRadius: '10px',
      fontSize: '13px', fontWeight: '600', cursor: 'pointer',
    },
  };

  const onFocus = e => { e.target.style.background = '#fff'; e.target.style.border = '1.5px solid rgba(37,99,235,0.35)'; };
  const onBlur  = e => { e.target.style.background = '#f1f3f9'; e.target.style.border = '1.5px solid #f1f3f9'; };

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
    <div style={s.page}>
      <div style={s.header}>
        <h2 style={s.title}>Profile Settings</h2>
        <p style={s.subtitle}>Manage your account information</p>
      </div>

      {/* Profile Information */}
      <div style={s.card}>
        <div style={s.cardHeaderRow}>
          <div style={s.iconBox('#eff6ff', '#2563eb')}><User size={20} /></div>
          <div>
            <p style={s.cardTitle}>Profile Information</p>
            <p style={s.cardSub}>Update your account details</p>
          </div>
        </div>
        <form onSubmit={handleSubmitUpdate}>
          <label style={s.fieldLabel}>Username</label>
          <input style={s.input} onFocus={onFocus} onBlur={onBlur} name="username" value={status.username} onChange={handleChange}/>
          <label style={s.fieldLabel}>Email</label>
          <input style={s.input} onFocus={onFocus} onBlur={onBlur} name="email" value={status.email} onChange={handleChange}/>
          <button type="submit" style={s.btnPrimary}>Update Profile</button>
        </form>
      </div>

      {/* Change Password */}
      <div style={s.card}>
        <div style={s.cardHeaderRow}>
          <div style={s.iconBox('#faf5ff', '#9333ea')}><Lock size={20} /></div>
          <div>
            <p style={s.cardTitle}>Change Password</p>
            <p style={s.cardSub}>Update your password to keep your account secure</p>
          </div>
        </div>
        <form onSubmit={handleSubmitPassword}>
          <label style={s.fieldLabel}>Current Password</label>
          <input type="password" style={s.input} onFocus={onFocus} onBlur={onBlur} onChange={handlePasswordChange} name='currentPassword' value={passwordStatus.currentPassword} />
          <label style={s.fieldLabel}>New Password</label>
          <input type="password" style={s.input} onFocus={onFocus} onBlur={onBlur} onChange={handlePasswordChange} name='newPassword' value={passwordStatus.newPassword} />
          <label style={s.fieldLabel}>Confirm New Password</label>
          <input type="password" style={s.input} onFocus={onFocus} onBlur={onBlur} onChange={handlePasswordChange} name='confirmNewPassword' value={passwordStatus.confirmNewPassword} />
          <button type="submit" style={s.btnSecondary}>Change Password</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
