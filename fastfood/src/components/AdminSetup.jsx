import React, { useState } from 'react';
import axios from 'axios';
import './AdminSetup.css';

function AdminSetup() {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const assignAdmin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const res = await axios.post(`http://localhost:8080/api/admin/assign-admin/${username}`);
            setMessage(res.data.message || 'Admin role assigned successfully!');
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Failed to assign admin role');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-setup-container">
            <div className="admin-setup-card">
                <h2>Assign Admin Role</h2>
                <p className="setup-info">
                    Enter your username to assign admin privileges.
                    After assignment, you'll need to login again.
                </p>
                
                <form onSubmit={assignAdmin}>
                    <div className="input-group">
                        <label>Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                            disabled={loading}
                        />
                    </div>
                    
                    {message && (
                        <div className="success-message">{message}</div>
                    )}
                    
                    {error && (
                        <div className="error-message">{error}</div>
                    )}
                    
                    <button className="button" type="submit" disabled={loading || !username}>
                        {loading ? 'Assigning...' : 'Assign Admin Role'}
                    </button>
                </form>
                
                <div className="sql-alternative">
                    <h3>Or run this SQL directly in your database:</h3>
                    <code>
                        INSERT INTO role (id, name) SELECT gen_random_uuid(), 'ROLE_ADMIN' WHERE NOT EXISTS (SELECT 1 FROM role WHERE name = 'ROLE_ADMIN');<br/>
                        INSERT INTO users_roles (users_id, roles_id) SELECT u.id, r.id FROM users u, role r WHERE u.username = '{username || 'YOUR_USERNAME'}' AND r.name = 'ROLE_ADMIN' AND NOT EXISTS (SELECT 1 FROM users_roles ur WHERE ur.users_id = u.id AND ur.roles_id = r.id);
                    </code>
                </div>
            </div>
        </div>
    );
}

export default AdminSetup;

