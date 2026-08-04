import { useState, useEffect } from 'react';

// Module-level cache to avoid re-fetching
const cache = new Map();

/**
 * Extracts owner and repo from a GitHub URL.
 * e.g. "https://github.com/VikramKavuri/Some-Repo" → { owner: "VikramKavuri", repo: "Some-Repo" }
 */
function parseGithubUrl(url) {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split('/').filter(Boolean);
    if (parts.length >= 2) {
      return { owner: parts[0], repo: parts[1] };
    }
  } catch (e) {
    // ignore
  }
  return null;
}

/**
 * Converts a flat GitHub tree array into a nested structure.
 * GitHub returns: [{ path: "src/app.py", type: "blob" }, { path: "src", type: "tree" }, ...]
 * We convert to: [{ name: "src", type: "folder", children: [{ name: "app.py", type: "file" }] }]
 */
function buildNestedTree(flatItems) {
  const root = [];
  const folderMap = new Map();

  // Sort so folders come before their contents
  const sorted = [...flatItems].sort((a, b) => a.path.localeCompare(b.path));

  for (const item of sorted) {
    const parts = item.path.split('/');
    const name = parts[parts.length - 1];
    const isFolder = item.type === 'tree';

    // Skip hidden files/folders and common noise
    if (name.startsWith('.') && name !== '.gitignore' && name !== '.env.example') continue;
    if (name === 'node_modules' || name === '__pycache__' || name === '.git') continue;

    const node = {
      name,
      type: isFolder ? 'folder' : 'file',
      path: item.path,
    };

    if (isFolder) {
      node.children = [];
      folderMap.set(item.path, node);
    } else {
      // Extract extension
      const dotIdx = name.lastIndexOf('.');
      if (dotIdx > 0) {
        node.extension = name.slice(dotIdx + 1);
      }
    }

    // Find parent
    if (parts.length === 1) {
      root.push(node);
    } else {
      const parentPath = parts.slice(0, -1).join('/');
      const parent = folderMap.get(parentPath);
      if (parent) {
        parent.children.push(node);
      } else {
        // Parent folder wasn't in the tree response; add to root
        root.push(node);
      }
    }
  }

  // Sort: folders first, then alphabetically
  const sortNodes = (nodes) => {
    nodes.sort((a, b) => {
      if (a.type === 'folder' && b.type !== 'folder') return -1;
      if (a.type !== 'folder' && b.type === 'folder') return 1;
      return a.name.localeCompare(b.name);
    });
    for (const node of nodes) {
      if (node.children) sortNodes(node.children);
    }
  };
  sortNodes(root);

  return root;
}

/**
 * Hook to fetch a GitHub repo's file tree.
 * @param {string} githubUrl - Full GitHub repo URL
 * @returns {{ tree: Array, loading: boolean, error: string|null, branch: string }}
 */
export default function useGithubTree(githubUrl) {
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [branch, setBranch] = useState('main');

  useEffect(() => {
    if (!githubUrl) {
      setLoading(false);
      return;
    }

    const parsed = parseGithubUrl(githubUrl);
    if (!parsed) {
      setError('Invalid GitHub URL');
      setLoading(false);
      return;
    }

    // Check cache
    if (cache.has(githubUrl)) {
      const cached = cache.get(githubUrl);
      setTree(cached.tree);
      setBranch(cached.branch);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const { owner, repo } = parsed;

    async function fetchTree(branchName) {
      const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branchName}?recursive=1`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json();
    }

    async function load() {
      setLoading(true);
      setError(null);

      try {
        let data;
        let usedBranch = 'main';

        try {
          data = await fetchTree('main');
        } catch {
          // Fallback to master
          data = await fetchTree('master');
          usedBranch = 'master';
        }

        if (cancelled) return;

        const nested = buildNestedTree(data.tree || []);
        cache.set(githubUrl, { tree: nested, branch: usedBranch });
        setTree(nested);
        setBranch(usedBranch);
      } catch (err) {
        if (!cancelled) {
          setError('Unable to load file structure');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [githubUrl]);

  return { tree, loading, error, branch };
}
