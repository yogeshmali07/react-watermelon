const mysql = require('mysql2/promise')

// 🔌 MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Tantragyan-72',
  database: 'react_watermelon'
})

/**
 * Get changes since lastPulledAt
 */
async function getChangesSince(lastPulledAt) {
  console.log("➡️ getChangesSince called with lastPulledAt:", lastPulledAt)

  const ts = lastPulledAt || 0
  const [rows] = await pool.query(
    'SELECT * FROM todos WHERE updated_at > ?',
    [ts]
  )

  console.log("📦 Rows fetched from DB:", rows.length)

  const changes = {
    todos: {
      created: [],  // WatermelonDB expects structure
      updated: [],
      deleted: []
    }
  }

  rows.forEach(r => {
    changes.todos.updated.push({
      id: r.id,
      title: r.title,
      is_done: !!r.is_done,
      updated_at: Number(r.updated_at),
      _status: r._status || null,
      _changed: r._changed || null
    })
  })

  console.log("✅ Returning changes:", JSON.stringify(changes, null, 2))
  return changes
}

/**
 * Handle client → server sync (PULL)
 */
async function handlePull(req, res) {
  console.log("📥 handlePull called")
  console.log("👉 Query params:", req.query)

  try {
    const lastPulledAt = parseInt(req.query.lastPulledAt || "0", 10)

    console.log("🔄 Pulling with lastPulledAt:", lastPulledAt)

    const changes = await getChangesSince(lastPulledAt)
    const timestamp = Date.now()

    console.log("📤 Sending pull response:", {
      timestamp,
      changesCount: changes.todos.updated.length
    })

    res.json({ changes, timestamp })
  } catch (err) {
    console.error("❌ Pull failed:", err)
    res.status(500).json({ error: "pull failed" })
  }
}

/**
 * Handle client → server sync (PUSH)
 */
async function handlePush(req, res) {
  console.log('🚀 Incoming POST /sync/push')
  console.log('📥 handlePush called')
  console.log('👉 Request body:', JSON.stringify(req.body, null, 2))

  try {
    const todosChanges = req.body.todos || { created: [], updated: [], deleted: [] }

    // ✅ Insert / Update (created + updated)
    const upserts = [...(todosChanges.created || []), ...(todosChanges.updated || [])]
    for (const record of upserts) {
      console.log('📝 Upserting:', record)
      await pool.query(
        `INSERT INTO todos (id, title, is_done, updated_at, _status, _changed)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           title = VALUES(title),
           is_done = VALUES(is_done),
           updated_at = VALUES(updated_at),
           _status = VALUES(_status),
           _changed = VALUES(_changed)`,
        [
          record.id,
          record.title,
          record.is_done,
          record.updated_at,
          record._status || null,
          record._changed || null
        ]
      )
    }

    // 🗑️ Handle Deletes
    for (const id of (todosChanges.deleted || [])) {
      console.log('🗑️ Deleting:', id)
      await pool.query('DELETE FROM todos WHERE id = ?', [id])
    }

    console.log(`✅ Push processed: upserted ${upserts.length}, deleted ${(todosChanges.deleted || []).length}`)
    res.json({ ok: true })
  } catch (err) {
    console.error('❌ Push failed:', err)
    res.status(500).json({ error: 'push failed' })
  }
}

module.exports = { handlePull, handlePush }
