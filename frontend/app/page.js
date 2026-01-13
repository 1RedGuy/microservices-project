'use client'

import { useState, useEffect } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function Home() {
  const [articles, setArticles] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const response = await fetch(`${API_URL}/api/articles`)
      const data = await response.json()
      setArticles(data)
    } catch (error) {
      console.error('Error fetching articles:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return

    setLoading(true)
    try {
      if (editingId) {
        await fetch(`${API_URL}/api/articles/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content })
        })
        setEditingId(null)
      } else {
        await fetch(`${API_URL}/api/articles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content })
        })
      }
      setTitle('')
      setContent('')
      fetchArticles()
    } catch (error) {
      console.error('Error saving article:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (article) => {
    setTitle(article.title)
    setContent(article.content || '')
    setEditingId(article.id)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this article?')) return

    try {
      await fetch(`${API_URL}/api/articles/${id}`, {
        method: 'DELETE'
      })
      fetchArticles()
    } catch (error) {
      console.error('Error deleting article:', error)
    }
  }

  const handleCancel = () => {
    setTitle('')
    setContent('')
    setEditingId(null)
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Articles Manager</h1>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2 style={{ marginTop: 0 }}>{editingId ? 'Edit Article' : 'Add New Article'}</h2>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px', minHeight: '100px' }}
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}
          >
            {loading ? 'Saving...' : (editingId ? 'Update' : 'Add')}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div>
        <h2>Articles ({articles.length})</h2>
        {articles.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>No articles yet. Add one above!</p>
        ) : (
          <div>
            {articles.map((article) => (
              <div key={article.id} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                <h3 style={{ marginTop: 0, color: '#333' }}>{article.title}</h3>
                {article.content && <p style={{ color: '#666', whiteSpace: 'pre-wrap' }}>{article.content}</p>}
                <p style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
                  Created: {new Date(article.created_at).toLocaleString()}
                </p>
                <div style={{ marginTop: '10px' }}>
                  <button
                    onClick={() => handleEdit(article)}
                    style={{ padding: '5px 15px', fontSize: '14px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    style={{ padding: '5px 15px', fontSize: '14px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
