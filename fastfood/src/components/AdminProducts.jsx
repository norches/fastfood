import React, { useEffect, useState } from 'react';
import {
    getProducts,
    createProduct,
    editProduct,
    deleteProduct,
    uploadProductImage,
    getProductImage
} from '../api/productApi';
import './AdminProducts.css';

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [form, setForm] = useState({ name: '', description: '', price: '', image: '' });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getProducts();
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const f = e.target.files?.[0];
        setFile(f || null);
        if (f) setPreview(URL.createObjectURL(f));
        else setPreview(null);
    };

    const resetForm = () => {
        setForm({ name: '', description: '', price: '', image: '' });
        setFile(null);
        setPreview(null);
        setEditingId(null);
    };

    const handleEdit = (product) => {
        setForm({
            name: product.name || '',
            description: product.description || '',
            price: product.price ?? '',
            image: product.image || ''
        });
        setEditingId(product.id);
        setPreview(product.image ? getProductImage(product.image) : null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Aniq uchirmoqchimisiz?')) return;
        try {
            await deleteProduct(id);
            await loadProducts();
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message;
            if (errorMsg.includes('foreign key') || errorMsg.includes('constraint')) {
                alert('Bu tovarni uchirib bulmaydi.');
            } else {
                alert('Delete failed: ' + errorMsg);
            }
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            let imageName = form.image;
            if (file) {
                imageName = await uploadProductImage(file);
            }

            const dto = {
                name: form.name,
                description: form.description,
                price: parseFloat(form.price) || 0,
                image: imageName || ''
            };

            if (editingId) {
                await editProduct(editingId, dto);
            } else {
                await createProduct(dto);
            }

            resetForm();
            await loadProducts();
        } catch (err) {
            alert(err.response?.data?.message || err.message || 'Save failed');
        } finally {
            setSaving(false);
        }
    };

    const removeImage = () => {
        setFile(null);
        setPreview(null);
        setForm(prev => ({ ...prev, image: '' }));
    };

    if (loading) {
        return (
            <div className="admin-products-container">
                <h2>Mahsulotlar yuklanmoqda...</h2>
            </div>
        );
    }

    return (
        <div className="admin-products-container">
            <div className="products-header">
                <h1>Mahsulotlarni boshqarish</h1>
                <div className="header-actions">
                    <button onClick={loadProducts} className="refresh-btn">Refresh</button>
                    <button onClick={() => window.location.href = '/admin'} className="back-btn">Buyurtmalarga qaytish</button>
                </div>
            </div>

            <div className="product-grid">
                <div className="product-form">
                    <h3>{editingId ? 'Mahsulotni tahrirlash' : 'Mahsulot qushish'}</h3>
                    {error && <div className="error">{error}</div>}
                    <form onSubmit={handleSave}>
                        <label>Nomi</label>
                        <input name="name" value={form.name} onChange={handleChange} required />

                        <label>Qo'shimcha ma'lumot</label>
                        <textarea name="description" value={form.description} onChange={handleChange} />

                        <label>Narxi</label>
                        <input name="price" value={form.price} onChange={handleChange} type="number" step="0.01" required />

                        <label>Rasmi</label>
                        <div className="file-input-wrapper">
                            <label htmlFor="file-upload" className="custom-file-upload">
                                <span className="file-upload-icon">📁</span>
                                {file ? 'Rasmni ozgartirish' : 'Rasm yuklash'}
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            {file && <div className="file-name">{file.name}</div>}
                        </div>

                        {preview && (
                            <div className="image-preview">
                                <img src={preview} alt="preview" />
                                <button
                                    type="button"
                                    className="remove-image"
                                    onClick={removeImage}
                                    title="Remove image"
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        <div className="form-actions">
                            <button type="submit" className="save-btn" disabled={saving}>
                                {saving ? 'Saving...' : (editingId ? 'Tahrirlash' : 'Mahsulot yuklash')}
                            </button>
                            <button type="button" className="cancel-btn" onClick={resetForm}>Bekor qilish</button>
                        </div>
                    </form>
                </div>

                <div className="product-list">
                    <h3>Mavjud mahsulotlar</h3>
                    {products.length === 0 ? (
                        <div>Mahsulotlar yo'q</div>
                    ) : (
                        <div className="grid">
                            {products.map(p => (
                                <div key={p.id} className="product-card">
                                    <div className="product-image">
                                        {p.image ? (
                                            <img src={getProductImage(p.image)} alt={p.name} />
                                        ) : (
                                            <div className="no-image">Rasm mavjud emas</div>
                                        )}
                                    </div>
                                    <div className="product-info">
                                        <h4>{p.name}</h4>
                                        <p className="price">{p.price} so'm</p>
                                        <p className="desc">{p.description}</p>
                                    </div>
                                    <div className="product-actions">
                                        <button onClick={() => handleEdit(p)} className="edit-btn">Tahrirlash</button>
                                        <button onClick={() => handleDelete(p.id)} className="delete-btn">O'chirish</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminProducts;