import { useFileSystem } from "@/context/FileContext"
import { FileSystemItem, Id } from "@/types/file"
import { getIconClassName } from "@/utils/getIconClassName"
import { Icon } from "@iconify/react"
import cn from "classnames"
import { useState } from "react"
import { AiOutlineFolder, AiOutlineFolderOpen } from "react-icons/ai"
import { FiChevronRight, FiChevronDown } from "react-icons/fi"
import { MdAdd } from "react-icons/md"
import { toast } from "react-hot-toast"

interface FileExplorerProps {
    className?: string
}

function FileTreeItem({
    item,
    level = 0,
    onFileSelect,
    createFile,
    createDirectory,
}: {
    item: FileSystemItem
    level?: number
    onFileSelect: (file: FileSystemItem) => void
    createFile: (parentDirId: Id, name: string) => void
    createDirectory: (parentDirId: Id, name: string) => void
}) {
    const { toggleDirectory } = useFileSystem()
    const [isExpanded, setIsExpanded] = useState(item.isOpen ?? false)
    const [showContextMenu, setShowContextMenu] = useState(false)
    const [contextPos, setContextPos] = useState({ x: 0, y: 0 })

    const isFolder = item.type === "directory"
    const hasChildren = item.children && item.children.length > 0

    const handleToggle = () => {
        setIsExpanded(!isExpanded)
        toggleDirectory(item.id)
    }

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault()
        setContextPos({ x: e.clientX, y: e.clientY })
        setShowContextMenu(true)
    }

    const handleCreateFile = () => {
        const fileName = prompt("Enter file name (e.g., index.js):")
        if (fileName?.trim()) {
            createFile(item.id, fileName)
            toast.success(`Created file: ${fileName}`)
        }
        setShowContextMenu(false)
    }

    const handleCreateFolder = () => {
        const folderName = prompt("Enter folder name:")
        if (folderName?.trim()) {
            createDirectory(item.id, folderName)
            toast.success(`Created folder: ${folderName}`)
        }
        setShowContextMenu(false)
    }

    const handleFileClick = () => {
        if (!isFolder) {
            onFileSelect(item)
        }
    }

    const paddingLeft = level * 16

    return (
        <>
            <div
                className={cn(
                    "group relative flex items-center gap-2 py-1.5 px-2 hover:bg-white/5 rounded cursor-pointer transition-colors duration-200",
                    !isFolder && "hover:bg-white/8",
                )}
                style={{ paddingLeft: `${paddingLeft}px` }}
                onClick={() => (isFolder ? handleToggle() : handleFileClick())}
                onContextMenu={isFolder ? handleContextMenu : undefined}
            >
                {/* Expand/Collapse Arrow */}
                {isFolder && hasChildren ? (
                    <button
                        className="flex-shrink-0 p-0.5 hover:bg-white/10 rounded transition-colors"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleToggle()
                        }}
                    >
                        {isExpanded ? (
                            <FiChevronDown size={16} className="text-white/60" />
                        ) : (
                            <FiChevronRight size={16} className="text-white/60" />
                        )}
                    </button>
                ) : isFolder ? (
                    <div className="w-4" />
                ) : (
                    <div className="w-4" />
                )}

                {/* Folder/File Icon */}
                <div className="flex-shrink-0 text-white/70">
                    {isFolder ? (
                        isExpanded ? (
                            <AiOutlineFolderOpen size={18} />
                        ) : (
                            <AiOutlineFolder size={18} />
                        )
                    ) : (
                        <Icon icon={getIconClassName(item.name)} width={18} height={18} />
                    )}
                </div>

                {/* File/Folder Name */}
                <span className="text-sm text-white/80 truncate select-none group-hover:text-white/95 transition-colors">
                    {item.name}
                </span>

                {/* Add Button (visible on hover for folders) */}
                {isFolder && (
                    <div className="ml-auto flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            className="p-1 hover:bg-white/20 rounded transition-colors"
                            title="Add file"
                            onClick={(e) => {
                                e.stopPropagation()
                                handleCreateFile()
                            }}
                        >
                            <MdAdd size={14} className="text-white/60" />
                        </button>
                    </div>
                )}

                {/* Context Menu */}
                {showContextMenu && (
                    <div
                        className="fixed z-50 bg-[#1e1e2e] border border-white/10 rounded-lg shadow-2xl overflow-hidden"
                        style={{
                            top: `${contextPos.y}px`,
                            left: `${contextPos.x}px`,
                        }}
                        onMouseLeave={() => setShowContextMenu(false)}
                    >
                        <button
                            className="block w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
                            onClick={handleCreateFile}
                        >
                            New File
                        </button>
                        <button
                            className="block w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
                            onClick={handleCreateFolder}
                        >
                            New Folder
                        </button>
                    </div>
                )}
            </div>

            {/* Render Children */}
            {isFolder && isExpanded && item.children && (
                <div>
                    {item.children.map((child) => (
                        <FileTreeItem
                            key={child.id}
                            item={child}
                            level={level + 1}
                            onFileSelect={onFileSelect}
                            createFile={createFile}
                            createDirectory={createDirectory}
                        />
                    ))}
                </div>
            )}
        </>
    )
}

export function FileExplorer({ className }: FileExplorerProps) {
    const { fileStructure, createFile, createDirectory, openFile } = useFileSystem()

    const handleFileSelect = (file: FileSystemItem) => {
        openFile(file.id)
    }

    return (
        <div
            className={cn(
                "flex flex-col h-full bg-gradient-to-b from-[#0f0f1f] to-[#0a0a14] border-r border-white/5",
                className,
            )}
        >
            {/* Header */}
            <div className="px-4 py-4 border-b border-white/5">
                <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wide">
                    Files
                </h3>
                <p className="text-xs text-white/40 mt-1">Right-click folders to add items</p>
            </div>

            {/* File Tree */}
            <div className="flex-1 overflow-auto px-2 py-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20">
                {fileStructure.children && fileStructure.children.length > 0 ? (
                    <div className="space-y-0">
                        {fileStructure.children.map((item) => (
                            <FileTreeItem
                                key={item.id}
                                item={item}
                                level={0}
                                onFileSelect={handleFileSelect}
                                createFile={createFile}
                                createDirectory={createDirectory}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-white/40 text-sm">No files yet</p>
                        <p className="text-white/25 text-xs mt-2">Create your first file to get started</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FileExplorer
