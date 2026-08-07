'use client'

import React, { useState, useEffect } from 'react'
import { 
    X, Plus, Save, Trash2, ArrowUp, ArrowDown, Info, 
    Sparkles, Image as ImageIcon, Bold, Italic, 
    Heading, Underline, Link as LinkIcon, Quote, 
    List, ListOrdered, Code, HelpCircle, ArrowRight,
    ChevronLeft, ChevronRight
} from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { useApp, EditablePage, FAQItem, PageSection, Product, Kurum, AltKategori } from '@/context/AppContext'
import CustomSelect from '@/components/ui/CustomSelect'
import styles from '../page.module.css'

interface PageCMSModalProps {
    isOpen: boolean
    onClose: () => void
    editingPage: EditablePage | null
    triggerToast: (message: string) => void
}

// Dynamic icon helper to render Lucide Icons by string name
const DynamicIcon = ({ name, size = 24, color }: { name: string; size?: number; color?: string }) => {
    const IconComponent = (LucideIcons as any)[name]
    if (!IconComponent) return <HelpCircle size={size} style={{ color }} />
    return <IconComponent size={size} style={{ color }} />
}

interface RichTextEditorProps {
    value: string
    onChange: (val: string) => void
    label: string
    required?: boolean
    id: string
}

const RichTextEditor = ({ value, onChange, label, required, id }: RichTextEditorProps) => {
    const editorRef = React.useRef<HTMLDivElement>(null)
    const isEditingRef = React.useRef(false)

    // Only update innerHTML when the user is not actively editing in this field
    React.useEffect(() => {
        if (editorRef.current && !isEditingRef.current) {
            editorRef.current.innerHTML = value || ''
        }
    }, [value])

    const handleBlur = () => {
        isEditingRef.current = false
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML)
        }
    }

    const handleFocus = () => {
        isEditingRef.current = true
    }

    const triggerCommand = (command: string) => {
        document.execCommand(command, false)
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML)
        }
    }

    return (
        <div className={styles.formGroup} style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ margin: 0, fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>{label} {required && '*'}</label>
                <div style={{ display: 'flex', gap: '3px' }}>
                    <button 
                        type="button" 
                        onMouseDown={(e) => { 
                            e.preventDefault(); 
                            triggerCommand('bold');
                        }} 
                        style={{ padding: '2px 6px', fontSize: '9px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', color: '#334155' }}
                        title="Kalın"
                    >
                        K
                    </button>
                    <button 
                        type="button" 
                        onMouseDown={(e) => { 
                            e.preventDefault(); 
                            triggerCommand('italic');
                        }} 
                        style={{ padding: '2px 6px', fontSize: '9px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', fontStyle: 'italic', color: '#334155' }}
                        title="İtalik"
                    >
                        İ
                    </button>
                    <button 
                        type="button" 
                        onMouseDown={(e) => { 
                            e.preventDefault(); 
                            triggerCommand('underline');
                        }} 
                        style={{ padding: '2px 6px', fontSize: '9px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', textDecoration: 'underline', color: '#334155' }}
                        title="Altı Çizili"
                    >
                        A
                    </button>
                    <button 
                        type="button" 
                        onMouseDown={(e) => { 
                            e.preventDefault(); 
                            triggerCommand('removeFormat');
                        }} 
                        style={{ padding: '2px 6px', fontSize: '9px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', color: '#ef4444' }}
                        title="Biçimlendirmeyi Temizle"
                    >
                        Temizle
                    </button>
                </div>
            </div>
            <div 
                ref={editorRef}
                id={id}
                contentEditable
                suppressContentEditableWarning
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={styles.formInput}
                style={{ minHeight: '38px', padding: '8px 12px', fontSize: '13px', background: 'white', color: '#0f172a', overflowY: 'auto' }}
            />
        </div>
    )
}

// Premium visual icon grid picker component with real-time library search
const VisualIconPicker = ({ value, onChange }: { value: string; onChange: (val: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const containerRef = React.useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Reset query when closed
    useEffect(() => {
        if (!isOpen) {
            setSearchQuery('')
        }
    }, [isOpen])

    const recommended = [
        { name: 'none', label: '❌ Simgesiz (İkon Yok)' },
        { name: 'MonitorPlay', label: 'Ders Paneli' },
        { name: 'ClipboardList', label: 'Soru Bankası' },
        { name: 'BookOpen', label: 'Dersler' },
        { name: 'Target', label: 'Sınavlar' },
        { name: 'GraduationCap', label: 'Milli Eğitim' },
        { name: 'HelpCircle', label: 'Yardım/Soru' },
        { name: 'Award', label: 'Ödül' },
        { name: 'Trophy', label: 'Kupa' },
        { name: 'Users', label: 'Kullanıcılar' },
        { name: 'RefreshCw', label: 'Oklar' },
        { name: 'Sparkles', label: 'Yıldızlar' },
        { name: 'Rocket', label: 'Slayt Roket' }
    ]

    // Get matching icons from the entire Lucide catalog dynamically
    const getSearchResults = () => {
        if (!searchQuery.trim()) return recommended;

        // Filter the complete key set of LucideIcons
        const queryLower = searchQuery.toLowerCase();
        const matches = Object.keys(LucideIcons)
            .filter(key => {
                // Match name, avoid internal helpers, keep PascalCase names
                return /^[A-Z][a-zA-Z0-9]*$/.test(key) &&
                       key.toLowerCase().includes(queryLower) &&
                       key !== 'createReactComponent';
            })
            .slice(0, 24) // limit to 24 results for clean layout
            .map(name => ({
                name,
                label: name.replace(/([A-Z])/g, ' $1').trim() // Convert CamelCase to spaced label
            }));

        // Put "Simgesiz" as option always if searching
        return [{ name: 'none', label: '❌ Simgesiz (İkon Yok)' }, ...matches];
    }

    const currentList = getSearchResults()
    const currentLabel = value === 'none' || !value 
        ? '❌ Simgesiz (İkon Yok)' 
        : (recommended.find(i => i.name === value)?.label || value);

    return (
        <div ref={containerRef} className={styles.iconPickerContainer}>
            <button 
                type="button" 
                className={styles.iconPickerSelectTrigger}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {value !== 'none' && value ? (
                        <DynamicIcon name={value} size={16} />
                    ) : (
                        <span style={{ fontSize: '12px' }}>❌</span>
                    )}
                    <span style={{ fontWeight: 'bold', fontSize: '12px' }}>
                        {currentLabel}
                    </span>
                </span>
                <span style={{ fontSize: '10px', color: '#64748b' }}>{isOpen ? '▲' : '▼'}</span>
            </button>
            
            {isOpen && (
                <div className={styles.iconPickerPopover} style={{ width: '300px' }}>
                    {/* Live search input */}
                    <div style={{ marginBottom: '8px' }}>
                        <input 
                            type="text"
                            placeholder="🔍 1200+ Simge içinde ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            style={{ 
                                width: '100%', 
                                padding: '8px 10px', 
                                fontSize: '11px', 
                                border: '1.5px solid #cbd5e1', 
                                borderRadius: '6px',
                                outline: 'none',
                                fontWeight: 'bold',
                                color: '#1e293b'
                            }}
                            className={styles.formInput}
                        />
                    </div>
                    
                    <div className={styles.iconPickerGrid} style={{ maxHeight: '200px' }}>
                        {currentList.map((ico) => (
                            <div 
                                key={ico.name}
                                className={`${styles.iconPickerItem} ${value === ico.name ? styles.iconPickerItemActive : ''}`}
                                onClick={() => {
                                    onChange(ico.name)
                                    setIsOpen(false)
                                }}
                                title={ico.label}
                                style={{ padding: '6px 4px' }}
                            >
                                {ico.name !== 'none' ? (
                                    <DynamicIcon name={ico.name} size={18} />
                                ) : (
                                    <span style={{ fontSize: '14px' }}>❌</span>
                                )}
                                <span className={styles.iconPickerItemLabel} style={{ fontSize: '8px' }}>
                                    {ico.name === 'none' ? 'Yok' : ico.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default function PageCMSModal({ isOpen, onClose, editingPage, triggerToast }: PageCMSModalProps) {
    const { 
        updatePage, kurumlar, pages, triggerConfirm, altKategoriler,
        products, featuredIds, updateFeaturedIds, updateMultipleProducts,
        reorderKurumlar, reorderAltKategoriler
    } = useApp()
    
    // UI tabs
    const [activeModalTab, setActiveModalTab] = useState<'content' | 'seo'>('content')
    const [activeHomeTab, setActiveHomeTab] = useState<'announcement' | 'slides' | 'cta' | 'yapboz'>('announcement')
    const [activePreviewSlideIndex, setActivePreviewSlideIndex] = useState(0)
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop')

    // Accordion state hooks for better UX
    const [expandedSlideIndex, setExpandedSlideIndex] = useState<number | null>(0)
    const [expandedSectionIndex, setExpandedSectionIndex] = useState<number | null>(0)

    // Local copy of items for homepage ordering and visibility toggling
    const [localProducts, setLocalProducts] = useState<Product[]>([])
    const [localFeaturedIds, setLocalFeaturedIds] = useState<string[]>([])
    const [localKurumlar, setLocalKurumlar] = useState<Kurum[]>([])
    const [localAltKategoriler, setLocalAltKategoriler] = useState<AltKategori[]>([])

    // Form state
    const [pageForm, setPageForm] = useState({
        title: '',
        slug: '',
        content: '',
        aboutText: '',
        aboutVision: '',
        aboutMission: '',
        phone: '',
        email: '',
        address: '',
        whatsapp: '',
        faqs: [] as FAQItem[],
        customSections: [] as PageSection[],
        showAnnouncement: true,
        announcementText: '',
        announcementLink: '',
        announcementBg: 'linear-gradient(90deg, #ef4444 0%, #f97316 100%)',
        announcementType: 'text' as 'text' | 'image',
        announcementImage: '',
        slides: [] as any[],
        ctaPanels: [] as any[],
        activeSections: {} as Record<string, boolean>,
        featuredSubcatOrders: [] as string[],
        sectionOrder: [] as string[],
        seoTitle: '',
        seoDescription: '',
        status: 'published' as 'published' | 'draft'
    })

    // Sync state when modal opens/page changes
    useEffect(() => {
        if (editingPage && isOpen) {
            setPageForm({
                title: editingPage.title || '',
                slug: editingPage.slug || '',
                content: editingPage.content || '',
                aboutText: editingPage.aboutText || '',
                aboutVision: editingPage.aboutVision || '',
                aboutMission: editingPage.aboutMission || '',
                phone: editingPage.phone || '',
                email: editingPage.email || '',
                address: editingPage.address || '',
                whatsapp: editingPage.whatsapp || '',
                faqs: editingPage.faqs ? [...editingPage.faqs] : [],
                customSections: editingPage.customSections ? [...editingPage.customSections] : [],
                showAnnouncement: editingPage.showAnnouncement !== undefined ? editingPage.showAnnouncement : true,
                announcementText: editingPage.announcementText || '',
                announcementLink: editingPage.announcementLink || '',
                announcementBg: editingPage.announcementBg || 'linear-gradient(90deg, #ef4444 0%, #f97316 100%)',
                announcementType: editingPage.announcementType || 'text',
                announcementImage: editingPage.announcementImage || '',
                slides: editingPage.slides ? [...editingPage.slides] : [],
                ctaPanels: editingPage.ctaPanels ? [...editingPage.ctaPanels] : [],
                activeSections: (editingPage as any).activeSections || {
                    slider: true,
                    ctaPanels: true,
                    featured: true,
                    subcategories: true,
                    kurumlar: true,
                    about: true
                },
                featuredSubcatOrders: editingPage.featuredSubcatOrders || [],
                sectionOrder: (editingPage as any).sectionOrder || ['slider', 'featured', 'subcategories', 'yapboz', 'about', 'kurumlar'],
                seoTitle: editingPage.seoTitle || '',
                seoDescription: editingPage.seoDescription || '',
                status: editingPage.status || 'published'
            })
            
            // Load and sort local items
            const sortedProds = [...(products || [])].sort((a, b) => {
                const isAFeatured = (featuredIds || []).includes(a.id)
                const isBFeatured = (featuredIds || []).includes(b.id)
                if (isAFeatured && isBFeatured) {
                    return (a.order ?? 9999) - (b.order ?? 9999)
                }
                if (isAFeatured) return -1
                if (isBFeatured) return 1
                return (a.order ?? 9999) - (b.order ?? 9999)
            })
            setLocalProducts(sortedProds)
            setLocalFeaturedIds([...(featuredIds || [])])

            const sortedKurums = [...(kurumlar || [])].sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
            setLocalKurumlar(sortedKurums)

            const subcatOrders = editingPage.featuredSubcatOrders || []
            const sortedSubcats = [...(altKategoriler || [])].sort((a, b) => {
                const idxA = subcatOrders.indexOf(a.id)
                const idxB = subcatOrders.indexOf(b.id)
                const isAFeatured = idxA > -1 && a.showOnHomepage
                const isBFeatured = idxB > -1 && b.showOnHomepage
                if (isAFeatured && isBFeatured) return idxA - idxB
                if (isAFeatured) return -1
                if (isBFeatured) return 1
                return (a.order ?? 9999) - (b.order ?? 9999)
            })
            setLocalAltKategoriler(sortedSubcats)

            setActiveModalTab('content')
            setActiveHomeTab('announcement')
            setActivePreviewSlideIndex(0)
        }
    }, [editingPage, isOpen])

    const handleToggleLocalProductFeatured = (productId: string) => {
        setLocalFeaturedIds(prev => {
            const isFeatured = prev.includes(productId)
            let nextIds: string[]
            if (isFeatured) {
                nextIds = prev.filter(id => id !== productId)
            } else {
                nextIds = [...prev, productId]
            }
            // Sort products so checked are at the top and maintain order
            setLocalProducts(prevProds => {
                const checked = prevProds.filter(p => nextIds.includes(p.id))
                const unchecked = prevProds.filter(p => !nextIds.includes(p.id))
                return [...checked, ...unchecked]
            })
            return nextIds
        })
    }

    const handleMoveLocalProduct = (index: number, direction: 'up' | 'down') => {
        const nextIndex = direction === 'up' ? index - 1 : index + 1
        if (nextIndex < 0 || nextIndex >= localProducts.length) return
        
        const newProducts = [...localProducts]
        const temp = newProducts[index]
        newProducts[index] = newProducts[nextIndex]
        newProducts[nextIndex] = temp
        setLocalProducts(newProducts)
    }

    const handleToggleLocalKurumHomepage = (kurumId: string) => {
        setLocalKurumlar(prev => 
            prev.map(k => k.id === kurumId ? { ...k, showOnHomepage: k.showOnHomepage === false ? true : false } : k)
        )
    }

    const handleMoveLocalKurum = (index: number, direction: 'up' | 'down') => {
        const nextIndex = direction === 'up' ? index - 1 : index + 1
        if (nextIndex < 0 || nextIndex >= localKurumlar.length) return
        
        const newKurums = [...localKurumlar]
        const temp = newKurums[index]
        newKurums[index] = newKurums[nextIndex]
        newKurums[nextIndex] = temp
        setLocalKurumlar(newKurums)
    }

    const handleToggleLocalAltKategoriHomepage = (catId: string) => {
        setLocalAltKategoriler(prev => {
            const updated = prev.map(c => c.id === catId ? { ...c, showOnHomepage: !c.showOnHomepage } : c)
            const checked = updated.filter(c => c.showOnHomepage)
            const unchecked = updated.filter(c => !c.showOnHomepage)
            const sorted = [...checked, ...unchecked]
            
            // Sync pageForm.featuredSubcatOrders
            const activeIds = sorted.filter(c => c.showOnHomepage).map(c => c.id)
            setPageForm(f => ({ ...f, featuredSubcatOrders: activeIds }))
            
            return sorted
        })
    }

    const handleMoveLocalAltKategori = (index: number, direction: 'up' | 'down') => {
        const nextIndex = direction === 'up' ? index - 1 : index + 1
        if (nextIndex < 0 || nextIndex >= localAltKategoriler.length) return
        
        const newCats = [...localAltKategoriler]
        const temp = newCats[index]
        newCats[index] = newCats[nextIndex]
        newCats[nextIndex] = temp
        setLocalAltKategoriler(newCats)
        
        // Sync pageForm.featuredSubcatOrders
        const activeIds = newCats.filter(c => c.showOnHomepage).map(c => c.id)
        setPageForm(f => ({ ...f, featuredSubcatOrders: activeIds }))
    }

    if (!isOpen || !editingPage) return null

    // Slugify helper
    const slugify = (text: string) => {
        const trMap: { [key: string]: string } = {
            'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
            'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
        }
        let cleaned = text
        for (const key in trMap) {
            cleaned = cleaned.replace(new RegExp(key, 'g'), trMap[key])
        }
        return cleaned
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '')
    }

    // FAQ Helpers
    const handleAddFaqItem = () => {
        setPageForm(prev => ({
            ...prev,
            faqs: [...prev.faqs, { id: 'f_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5), q: '', a: '' }]
        }))
    }

    const handleRemoveFaqItem = (index: number) => {
        setPageForm(prev => ({
            ...prev,
            faqs: prev.faqs.filter((_, idx) => idx !== index)
        }))
    }

    const handleFaqItemChange = (index: number, field: 'q' | 'a', value: string) => {
        setPageForm(prev => {
            const list = [...prev.faqs]
            list[index] = { ...list[index], [field]: value }
            return { ...prev, faqs: list }
        })
    }

    // Slide Helpers
    const handleAddSlide = () => {
        setPageForm(prev => ({
            ...prev,
            slides: [
                ...(prev.slides || []),
                {
                    id: 'slide_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                    title: '',
                    subtitle: '',
                    cta: 'İncele',
                    link: '/products',
                    icon: 'Rocket',
                    iconColor: '#3b82f6'
                }
            ]
        }))
    }

    const handleRemoveSlide = (index: number) => {
        setPageForm(prev => {
            const updatedSlides = (prev.slides || []).filter((_, idx) => idx !== index)
            // Safety reset preview index if target is removed
            if (activePreviewSlideIndex >= updatedSlides.length) {
                setActivePreviewSlideIndex(Math.max(0, updatedSlides.length - 1))
            }
            return {
                ...prev,
                slides: updatedSlides
            }
        })
    }

    const handleSlideChange = (index: number, field: string, value: any) => {
        setPageForm(prev => {
            const list = [...(prev.slides || [])]
            list[index] = { ...list[index], [field]: value }
            return { ...prev, slides: list }
        })
    }

    const insertTag = (slideIndex: number, field: 'title' | 'subtitle', tag: string) => {
        const inputEl = document.getElementById(`slide-${field}-${slideIndex}`) as HTMLInputElement
        if (!inputEl) return

        const start = inputEl.selectionStart || 0
        const end = inputEl.selectionEnd || 0
        const val = inputEl.value
        const textSelected = val.substring(start, end)
        const replacement = `<${tag}>${textSelected}</${tag}>`

        const newVal = val.substring(0, start) + replacement + val.substring(end)
        handleSlideChange(slideIndex, field, newVal)

        setTimeout(() => {
            inputEl.focus()
            const cursorOffset = tag.length + 2
            inputEl.setSelectionRange(start + cursorOffset, start + cursorOffset + textSelected.length)
        }, 100)
    }

    const compressImage = (base64Str: string, maxWidth = 800, maxHeight = 800, quality = 0.7): Promise<string> => {
        return new Promise((resolve) => {
            const img = new window.Image()
            img.src = base64Str
            img.onload = () => {
                const canvas = document.createElement('canvas')
                let width = img.width
                let height = img.height

                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width)
                        width = maxWidth
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height)
                        height = maxHeight
                    }
                }

                canvas.width = width
                canvas.height = height

                const ctx = canvas.getContext('2d')
                if (!ctx) {
                    resolve(base64Str)
                    return
                }

                ctx.drawImage(img, 0, 0, width, height)
                const compressedBase64 = canvas.toDataURL('image/jpeg', quality)
                resolve(compressedBase64)
            }
            img.onerror = () => {
                resolve(base64Str)
            }
        })
    }

    const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
        setPageForm(prev => {
            const list = [...(prev.slides || [])]
            const targetIndex = direction === 'up' ? index - 1 : index + 1
            if (targetIndex < 0 || targetIndex >= list.length) return prev
            
            // Swap
            const temp = list[index]
            list[index] = list[targetIndex]
            list[targetIndex] = temp
            
            return { ...prev, slides: list }
        })
    }

    const handleCtaCardChange = (index: number, field: string, value: any) => {
        setPageForm(prev => {
            const list = [...(prev.ctaPanels || [])]
            list[index] = { ...list[index], [field]: value }
            return { ...prev, ctaPanels: list }
        })
    }

    // Dynamic Sections Helpers
    const handleAddCustomSection = () => {
        setPageForm(prev => ({
            ...prev,
            customSections: [
                ...(prev.customSections || []),
                {
                    id: 'sect_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                    title: '',
                    content: '',
                    layout: 'card',
                    icon: 'Award',
                    iconColor: '#3b82f6',
                    buttonText: '',
                    buttonLink: '',
                    buttonStyle: 'primary'
                }
            ]
        }))
    }

    const handleRemoveCustomSection = (index: number) => {
        setPageForm(prev => ({
            ...prev,
            customSections: (prev.customSections || []).filter((_, idx) => idx !== index)
        }))
    }

    const handleCustomSectionChange = (index: number, field: string, value: any) => {
        setPageForm(prev => {
            const list = [...(prev.customSections || [])]
            list[index] = { ...list[index], [field]: value }
            return { ...prev, customSections: list }
        })
    }

    const handleMoveCustomSection = (index: number, direction: 'up' | 'down') => {
        setPageForm(prev => {
            const list = [...(prev.customSections || [])]
            const targetIndex = direction === 'up' ? index - 1 : index + 1
            if (targetIndex < 0 || targetIndex >= list.length) return prev
            
            // Swap
            const temp = list[index]
            list[index] = list[targetIndex]
            list[targetIndex] = temp
            
            return { ...prev, customSections: list }
        })
    }

    // WYSIWYG Tag Injector (Overloaded to handle multiple textareas and back-compatibility)
    const insertHtmlTag = (
        arg1: string,
        arg2: string = '',
        arg3: string = '',
        arg4: string = ''
    ) => {
        let elementId = 'page-content-textarea'
        let fieldName = 'content'
        let tagOpen = arg1
        let tagClose = arg2

        if (arg3 !== '') {
            elementId = arg1
            fieldName = arg2
            tagOpen = arg3
            tagClose = arg4
        } else if (arg1 && arg2 && !arg1.startsWith('<') && !arg1.startsWith('&')) {
            elementId = arg1
            fieldName = arg2
            tagOpen = arg3 || arg2
            tagClose = ''
        }

        const textarea = document.getElementById(elementId) as HTMLTextAreaElement
        if (!textarea) return
        
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const text = textarea.value
        const selectedText = text.substring(start, end)
        const replacement = tagOpen + selectedText + tagClose
        
        const newContent = text.substring(0, start) + replacement + text.substring(end)
        
        setPageForm(prev => {
            if (fieldName.startsWith('customSections[')) {
                const match = fieldName.match(/customSections\[(\d+)\]\.(.+)/)
                if (match) {
                    const index = parseInt(match[1])
                    const subField = match[2]
                    const list = [...(prev.customSections || [])]
                    list[index] = { ...list[index], [subField]: newContent }
                    return { ...prev, customSections: list }
                }
            }
            if (fieldName.startsWith('faqs[')) {
                const match = fieldName.match(/faqs\[(\d+)\]\.(.+)/)
                if (match) {
                    const index = parseInt(match[1])
                    const subField = match[2]
                    const list = [...(prev.faqs || [])]
                    list[index] = { ...list[index], [subField]: newContent }
                    return { ...prev, faqs: list }
                }
            }
            return { ...prev, [fieldName]: newContent }
        })
        
        setTimeout(() => {
            textarea.focus()
            textarea.setSelectionRange(start + tagOpen.length, start + tagOpen.length + selectedText.length)
        }, 50)
    }

    const renderToolbar = (elementId: string, fieldName: string) => {
        return (
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '6px', background: '#f8fafc', padding: '6px', borderRadius: '8px', border: '1px solid #e2e8f0', justifyContent: 'flex-start' }}>
                <button type="button" onClick={() => insertHtmlTag(elementId, fieldName, '<strong>', '</strong>')} style={{ padding: '4px 8px', fontSize: '11px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Kalın">
                    <Bold size={11} />
                </button>
                <button type="button" onClick={() => insertHtmlTag(elementId, fieldName, '<em>', '</em>')} style={{ padding: '4px 8px', fontSize: '11px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="İtalik">
                    <Italic size={11} />
                </button>
                <button type="button" onClick={() => insertHtmlTag(elementId, fieldName, '<u>', '</u>')} style={{ padding: '4px 8px', fontSize: '11px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Altı Çizili">
                    <Underline size={11} />
                </button>
                <button type="button" onClick={() => insertHtmlTag(elementId, fieldName, '<ul>\n  <li>', '</li>\n</ul>')} style={{ padding: '4px 8px', fontSize: '11px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Sırasız Liste">
                    <List size={11} />
                </button>
                <button type="button" onClick={() => insertHtmlTag(elementId, fieldName, '<ol>\n  <li>', '</li>\n</ol>')} style={{ padding: '4px 8px', fontSize: '11px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Sıralı Liste">
                    <ListOrdered size={11} />
                </button>
                <button type="button" onClick={() => insertHtmlTag(elementId, fieldName, '<a href="#" target="_blank">', '</a>')} style={{ padding: '4px 8px', fontSize: '11px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Bağlantı Ekle">
                    <LinkIcon size={11} />
                </button>
                <button type="button" onClick={() => insertHtmlTag(elementId, fieldName, '<blockquote>', '</blockquote>')} style={{ padding: '4px 8px', fontSize: '11px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Alıntı">
                    <Quote size={11} />
                </button>
                <button type="button" onClick={() => insertHtmlTag(elementId, fieldName, '<br />')} style={{ padding: '4px 8px', fontSize: '11px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer' }} title="Satır Atla">
                    ↵ Boşluk
                </button>
            </div>
        )
    }

    const renderSwitchToggle = (label: string, checked: boolean, onChange: (val: boolean) => void) => {
        return (
            <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                gap: '8px', 
                padding: '10px 14px', 
                background: 'white', 
                borderRadius: '10px', 
                border: '1px solid #e2e8f0', 
                cursor: 'pointer', 
                fontSize: '11px', 
                fontWeight: '700', 
                color: '#1e293b',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                transition: 'all 0.15s ease',
                userSelect: 'none'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#cbd5e1'
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.04)'
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0'
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)'
            }}
            >
                <span>{label}</span>
                <div style={{
                    position: 'relative',
                    width: '34px',
                    height: '20px',
                    backgroundColor: checked ? '#10b981' : '#cbd5e1',
                    borderRadius: '10px',
                    transition: 'background-color 0.2s ease',
                    flexShrink: 0
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '2px',
                        left: checked ? '16px' : '2px',
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                        transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} />
                </div>
                <input 
                    type="checkbox" 
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    style={{ display: 'none' }}
                />
            </label>
        )
    }

    const handleActiveSectionToggle = (key: string, value: boolean) => {
        setPageForm(prev => ({
            ...prev,
            activeSections: {
                ...(prev.activeSections || {
                    slider: true,
                    ctaPanels: true,
                    featured: true,
                    subcategories: true,
                    kurumlar: true,
                    about: true
                }),
                [key]: value
            }
        }))
    }

    const handleMoveFeaturedSubcat = (index: number, direction: 'up' | 'down') => {
        setPageForm(prev => {
            const list = [...(prev.featuredSubcatOrders || [])]
            const targetIndex = direction === 'up' ? index - 1 : index + 1
            if (targetIndex < 0 || targetIndex >= list.length) return prev
            
            const temp = list[index]
            list[index] = list[targetIndex]
            list[targetIndex] = temp
            
            return { ...prev, featuredSubcatOrders: list }
        })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        const isCustomPage = editingPage.id.startsWith('custom_')
        
        // Base fields
        const pageData: any = {
            title: pageForm.title?.trim() || '',
            seoTitle: pageForm.seoTitle?.trim() || '',
            seoDescription: pageForm.seoDescription?.trim() || '',
            status: pageForm.status,
            createdAt: editingPage.createdAt || new Date().toISOString()
        }

        if (isCustomPage) {
            // Slugify the title if slug is empty
            const slugify = (text: string) => {
                return text.toString().toLowerCase()
                    .replace(/\s+/g, '-')           
                    .replace(/[^\w\-]+/g, '')       
                    .replace(/\-\-+/g, '-')         
                    .replace(/^-+/, '')             
                    .replace(/-+$/, '');            
            }
            
            pageData.slug = pageForm.slug?.trim() || slugify(pageForm.title?.trim() || '')
            pageData.content = pageForm.content?.trim() || ''
            
            const isNewPage = !pages.some(p => p.id === editingPage.id)
            if (isNewPage) {
                // @ts-ignore
                addPage({ ...editingPage, ...pageData })
                triggerToast('Yeni özel sayfa başarıyla oluşturuldu!')
                onClose()
                return
            }
        } else if (editingPage.id === 'home') {
            pageData.showAnnouncement = pageForm.showAnnouncement
            pageData.announcementText = pageForm.announcementText?.trim() || ''
            pageData.announcementLink = pageForm.announcementLink?.trim() || ''
            pageData.announcementBg = pageForm.announcementBg?.trim() || ''
            pageData.announcementType = pageForm.announcementType
            pageData.announcementImage = pageForm.announcementImage
            pageData.slides = pageForm.slides?.map(s => ({ ...s, title: s.title?.trim() || '', subtitle: s.subtitle?.trim() || '' })) || []
            pageData.ctaPanels = pageForm.ctaPanels
            pageData.customSections = pageForm.customSections
            pageData.activeSections = pageForm.activeSections
            pageData.featuredSubcatOrders = pageForm.featuredSubcatOrders
            pageData.sectionOrder = pageForm.sectionOrder

            // 1. Save featured products ordering and homepage visibility
            const sortedFeaturedProducts = localProducts.filter(p => localFeaturedIds.includes(p.id))
            const productUpdates = localProducts.map(p => {
                const isFeatured = localFeaturedIds.includes(p.id)
                const featIndex = sortedFeaturedProducts.findIndex(fp => fp.id === p.id)
                const orderVal = isFeatured ? featIndex + 1 : 9999
                return {
                    id: p.id,
                    fields: {
                        showOnHomepage: isFeatured,
                        order: orderVal
                    }
                }
            })
            updateMultipleProducts(productUpdates)
            updateFeaturedIds(localFeaturedIds)

            // 2. Save institutions ordering and homepage visibility
            const updatedKurumList = localKurumlar.map((k, idx) => ({
                ...k,
                order: idx + 1
            }))
            reorderKurumlar(updatedKurumList)

            // 3. Save subcategories ordering and homepage visibility
            const updatedAltKategoriList = localAltKategoriler.map((c, idx) => ({
                ...c,
                order: idx + 1
            }))
            reorderAltKategoriler(updatedAltKategoriList)
        } else if (editingPage.id === 'about') {
            pageData.aboutText = pageForm.aboutText?.trim() || ''
            pageData.aboutVision = pageForm.aboutVision?.trim() || ''
            pageData.aboutMission = pageForm.aboutMission?.trim() || ''
            pageData.customSections = pageForm.customSections
        } else if (editingPage.id === 'contact') {
            pageData.phone = pageForm.phone?.trim() || ''
            pageData.email = pageForm.email?.trim() || ''
            pageData.address = pageForm.address?.trim() || ''
            pageData.whatsapp = pageForm.whatsapp?.trim() || ''
        } else if (editingPage.id === 'faq') {
            pageData.faqs = pageForm.faqs
        } else {
            // Legal agreements
            pageData.content = pageForm.content?.trim() || ''
        }

        updatePage(editingPage.id, pageData)
        triggerToast('Sayfa içeriği başarıyla güncellendi!')
        onClose()
    }

    const isWidescreenMode = ['home', 'about'].includes(editingPage.id)

    return (
        <div className={styles.modalOverlay}>
            <div 
                className={styles.modalContainer} 
                style={{ 
                    maxWidth: isWidescreenMode 
                        ? '1440px' 
                        : (editingPage.id === 'faq' || ['terms', 'privacy', 'shipping', 'returns'].includes(editingPage.id) ? '900px' : '750px'),
                    width: '95vw'
                }}
            >
                <div className={styles.modalHeader}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h2 style={{ fontSize: '15px', fontWeight: '800', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>📄 SAYFA İÇERİĞİNİ DÜZENLE</span>
                            <span style={{ fontSize: '11px', padding: '3px 7px', background: '#e2e8f0', color: '#475569', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                                Sayfa Kimliği: {editingPage.id}
                            </span>
                        </h2>
                        <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', marginTop: '2px', fontFamily: 'monospace' }}>
                            LINK: /pages/{editingPage.slug}
                        </span>
                    </div>
                    <button className={styles.modalCloseBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 0, overflow: 'hidden' }}>
                    <div className={styles.widescreenSplitBody || ''} style={{ display: 'flex', flexDirection: 'row', overflow: 'hidden', flexGrow: 1, minHeight: 0 }}>
                        
                        {/* LEFT COLUMN: EDITING FORM CONTROLS */}
                        <div className={styles.modalBody} style={{ flex: isWidescreenMode ? '1.2' : '1', width: isWidescreenMode ? '60%' : '100%', padding: '20px', overflowY: 'auto', borderRight: isWidescreenMode ? '1px solid #e2e8f0' : 'none', minHeight: 0 }}>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    
                                    {/* Tab Content: Home tab controls */}
                                    {editingPage.id === 'home' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            <div className={styles.formRow}>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="page-title">Sayfa Başlığı *</label>
                                                    <input 
                                                        id="page-title"
                                                        type="text"
                                                        required
                                                        value={pageForm.title}
                                                        onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })}
                                                        className={styles.formInput}
                                                    />
                                                </div>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="page-status">Yayın Durumu *</label>
                                                    <CustomSelect
                                                        id="page-status"
                                                        value={pageForm.status}
                                                        onChange={(val) => setPageForm({ ...pageForm, status: val as 'published' | 'draft' })}
                                                        options={[
                                                            { value: 'published', label: "Yayında (Menü & Footer'da Gösterilir)" },
                                                            { value: 'draft', label: 'Taslak (Ziyaretçilere Gizlenir)' }
                                                        ]}
                                                    />
                                                </div>
                                            </div>

                                            {/* Homepage Wizard Sekme Switchers */}
                                            <div className={styles.homeTabsSwitch} style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '6px', borderRadius: '8px', marginBottom: '8px' }}>
                                                <button 
                                                    type="button" 
                                                    onClick={() => setActiveHomeTab('announcement')}
                                                    className={styles.homeTabSwitchBtn}
                                                    style={{ flexGrow: 1, padding: '8px', fontSize: '11px', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer', background: activeHomeTab === 'announcement' ? 'white' : 'transparent', boxShadow: activeHomeTab === 'announcement' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                                                >
                                                    📢 Duyuru Şeridi
                                                </button>
                                                <button 
                                                    type="button" 
                                                    onClick={() => setActiveHomeTab('slides')}
                                                    className={styles.homeTabSwitchBtn}
                                                    style={{ flexGrow: 1, padding: '8px', fontSize: '11px', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer', background: activeHomeTab === 'slides' ? 'white' : 'transparent', boxShadow: activeHomeTab === 'slides' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                                                >
                                                    🦧 Giriş Slaytları (Slider)
                                                </button>
                                                <button 
                                                    type="button" 
                                                    onClick={() => setActiveHomeTab('cta')}
                                                    className={styles.homeTabSwitchBtn}
                                                    style={{ flexGrow: 1, padding: '8px', fontSize: '11px', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer', background: activeHomeTab === 'cta' ? 'white' : 'transparent', boxShadow: activeHomeTab === 'cta' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                                                >
                                                    ⚡ Giriş Yan Kartları
                                                </button>
                                                <button 
                                                    type="button" 
                                                    onClick={() => setActiveHomeTab('yapboz')}
                                                    className={styles.homeTabSwitchBtn}
                                                    style={{ flexGrow: 1, padding: '8px', fontSize: '11px', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer', background: activeHomeTab === 'yapboz' ? 'white' : 'transparent', boxShadow: activeHomeTab === 'yapboz' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                                                >
                                                    🧩 Modüler Bölümler
                                                </button>
                                            </div>

                                            {/* SEKME 1: DUYURU ŞERİDİ */}
                                            {activeHomeTab === 'announcement' && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                    <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e293b', textTransform: 'uppercase' }}>Duyuru Bandı Ayarları</h3>
                                                    <p style={{ fontSize: '12px', color: '#64748b', marginTop: '-8px' }}>Sitenin en tepesinde, tüm sayfalarda görünecek duyuru şeridi koordinatları.</p>
                                                    
                                                    <div className={styles.formRow}>
                                                        <div className={styles.formGroup}>
                                                            <label>Duyuru Bandı Durumu</label>
                                                            <CustomSelect
                                                                value={pageForm.showAnnouncement ? 'yes' : 'no'}
                                                                onChange={(val) => setPageForm({ ...pageForm, showAnnouncement: val === 'yes' })}
                                                                options={[
                                                                    { value: 'yes', label: 'Aktif (Yayında Göster)' },
                                                                    { value: 'no', label: 'Pasif (Gizle)' }
                                                                ]}
                                                            />
                                                        </div>
                                                        <div className={styles.formGroup}>
                                                            <label>Duyuru Türü / Tasarımı</label>
                                                            <CustomSelect
                                                                value={pageForm.announcementType || 'text'}
                                                                onChange={(val) => setPageForm({ ...pageForm, announcementType: val as 'text' | 'image' })}
                                                                options={[
                                                                    { value: 'text', label: '✍️ Metin ve Renk/Gradyan' },
                                                                    { value: 'image', label: '🖼️ Özel Görsel Banner Yükle' }
                                                                ]}
                                                            />
                                                        </div>
                                                    </div>

                                                    {pageForm.announcementType === 'image' ? (
                                                        <div className={styles.formGroup}>
                                                            <label>Duyuru Şeridi Görseli (Önerilen: 1920x50px veya benzer yatay şerit)</label>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                                                                <div style={{ width: '120px', height: '40px', background: '#e2e8f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px dashed #94a3b8' }}>
                                                                    {pageForm.announcementImage ? (
                                                                        <img src={pageForm.announcementImage} alt="Önizleme" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                    ) : (
                                                                        <span style={{ fontSize: '10px', color: '#64748b' }}>Görsel Yok</span>
                                                                    )}
                                                                </div>
                                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                                    <label htmlFor="file-upload-announcement" className={styles.btnSubmit} style={{ margin: 0, padding: '6px 12px', fontSize: '11px', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', boxShadow: 'none', cursor: 'pointer' }}>
                                                                        Görsel Yükle
                                                                    </label>
                                                                    <input 
                                                                        id="file-upload-announcement"
                                                                        type="file"
                                                                        accept="image/*"
                                                                        style={{ display: 'none' }}
                                                                        onChange={(e) => {
                                                                            const file = e.target.files?.[0]
                                                                            if (!file) return
                                                                            if (file.size > 10 * 1024 * 1024) {
                                                                                triggerConfirm({
                                                                                    title: 'Dosya Çok Büyük',
                                                                                    message: `"${file.name}" çok büyük! Maksimum 10 MB yükleyebilirsiniz.`,
                                                                                    confirmText: 'Tamam',
                                                                                    cancelText: 'Kapat',
                                                                                    isDangerous: true,
                                                                                    onConfirm: () => {}
                                                                                })
                                                                                return
                                                                            }
                                                                            const reader = new FileReader()
                                                                            reader.onloadend = async () => {
                                                                                if (reader.result) {
                                                                                    try {
                                                                                        const compressed = await compressImage(reader.result as string)
                                                                                        setPageForm({ ...pageForm, announcementImage: compressed })
                                                                                    } catch (err) {
                                                                                        setPageForm({ ...pageForm, announcementImage: reader.result as string })
                                                                                    }
                                                                                }
                                                                            }
                                                                            reader.readAsDataURL(file)
                                                                        }}
                                                                    />
                                                                    {pageForm.announcementImage && (
                                                                        <button 
                                                                            type="button" 
                                                                            className={styles.actionDeleteBtn}
                                                                            onClick={() => setPageForm({ ...pageForm, announcementImage: '' })}
                                                                            style={{ padding: '4px 10px', fontSize: '11px' }}
                                                                        >
                                                                            Görseli Kaldır
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className={styles.formRow}>
                                                                <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                                                                    <label>Şerit Arka Plan Rengi / Gradyan</label>
                                                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                                        <input 
                                                                            type="text" 
                                                                            value={pageForm.announcementBg || ''}
                                                                            onChange={(e) => setPageForm({ ...pageForm, announcementBg: e.target.value })}
                                                                            className={styles.formInput}
                                                                            placeholder="Örn: linear-gradient(90deg, #ef4444, #f97316)"
                                                                        />
                                                                        <input 
                                                                            type="color" 
                                                                            onChange={(e) => setPageForm({ ...pageForm, announcementBg: e.target.value })}
                                                                            style={{ width: '40px', height: '36px', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', padding: 0, flexShrink: 0 }}
                                                                        />
                                                                    </div>
                                                                    <div className={styles.gradientPresetGrid}>
                                                                        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', marginRight: '4px' }}>Hazır Temalar:</span>
                                                                        {[
                                                                            { name: 'Sunset Flare', bg: 'linear-gradient(90deg, #ef4444 0%, #f97316 100%)' },
                                                                            { name: 'Royal Night', bg: 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)' },
                                                                            { name: 'Ocean Deep', bg: 'linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%)' },
                                                                            { name: 'Emerald Meadow', bg: 'linear-gradient(90deg, #10b981 0%, #059669 100%)' },
                                                                            { name: 'Mevzuat Adam Gold', bg: 'linear-gradient(90deg, #d97706 0%, #b45309 100%)' }
                                                                        ].map((preset) => (
                                                                            <button
                                                                                key={preset.name}
                                                                                type="button"
                                                                                onClick={() => setPageForm({ ...pageForm, announcementBg: preset.bg })}
                                                                                className={styles.gradientPresetBtn}
                                                                                title={preset.name}
                                                                            >
                                                                                <span 
                                                                                    className={styles.gradientColorPreviewCircle} 
                                                                                    style={{ background: preset.bg }}
                                                                                />
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className={styles.formGroup}>
                                                                <label>Duyuru Yazısı *</label>
                                                                <input 
                                                                    type="text"
                                                                    value={pageForm.announcementText || ''}
                                                                    onChange={(e) => setPageForm({ ...pageForm, announcementText: e.target.value })}
                                                                    className={styles.formInput}
                                                                    placeholder="Örn: 🔥 Adalet Bakanlığı GYS Kitap Setimiz Satışa Çıktı! Sınırlı Sayıda Stok İçin Tıklayın."
                                                                />
                                                            </div>
                                                        </>
                                                    )}

                                                    <div className={styles.formGroup}>
                                                        <label>Yönlendirilecek Bağlantı (İsteğe Bağlı)</label>
                                                        <input 
                                                            type="text"
                                                            value={pageForm.announcementLink || ''}
                                                            onChange={(e) => setPageForm({ ...pageForm, announcementLink: e.target.value })}
                                                            className={styles.formInput}
                                                            placeholder="Örn: /products veya /contact"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* SEKME 2: SLIDER SLAYTLARI */}
                                            {activeHomeTab === 'slides' && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                    <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e293b', textTransform: 'uppercase' }}>Giriş Slaytları Yöneticisi ({pageForm.slides ? pageForm.slides.length : 0})</h3>
                                                    
                                                    <div className={styles.faqList}>
                                                        {pageForm.slides && pageForm.slides.map((slide, idx) => (
                                                            <div key={slide.id || idx} className={styles.faqItemRow} style={{ border: '1px solid #cbd5e1', background: '#f8fafc', padding: '16px' }}>
                                                                <div 
                                                                    className={styles.faqItemHeader}
                                                                    onClick={(e) => {
                                                                        const target = e.target as HTMLElement
                                                                        if (target.closest('button')) return
                                                                        setExpandedSlideIndex(expandedSlideIndex === idx ? null : idx)
                                                                    }}
                                                                    style={{ cursor: 'pointer', userSelect: 'none' }}
                                                                >
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                        <span style={{ fontSize: '11px', color: '#64748b' }}>
                                                                            {expandedSlideIndex === idx ? '▼' : '▶'}
                                                                        </span>
                                                                        <span className={styles.faqItemTitle} style={{ color: '#2563eb', fontWeight: '800' }}>
                                                                            Slayt #{idx + 1}: {slide.title ? slide.title.replace(/<[^>]*>?/gm, '') : 'Başlıksız Slayt'}
                                                                        </span>
                                                                    </div>
                                                                    
                                                                    <div style={{ display: 'flex', gap: '4px' }}>
                                                                        <button
                                                                            type="button"
                                                                            className={styles.starBtn}
                                                                            onClick={() => handleMoveSlide(idx, 'up')}
                                                                            title="Yukarı Taşı"
                                                                        >
                                                                            <ArrowUp size={12} />
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            className={styles.starBtn}
                                                                            onClick={() => handleMoveSlide(idx, 'down')}
                                                                            title="Aşağı Taşı"
                                                                        >
                                                                            <ArrowDown size={12} />
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            className={styles.actionDeleteBtn}
                                                                            onClick={() => handleRemoveSlide(idx)}
                                                                            title="Slaytı Kaldır"
                                                                            style={{ padding: '4px 8px' }}
                                                                        >
                                                                            <Trash2 size={12} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                
                                                                {expandedSlideIndex === idx && (
                                                                    <div className={styles.adminForm} style={{ marginTop: '12px', border: 'none', padding: 0 }}>
                                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                                        <RichTextEditor 
                                                                            id={`slide-title-${idx}`}
                                                                            label="Slayt Başlığı *"
                                                                            required
                                                                            value={slide.title || ''}
                                                                            onChange={(val) => handleSlideChange(idx, 'title', val)}
                                                                        />
                                                                        <RichTextEditor 
                                                                            id={`slide-subtitle-${idx}`}
                                                                            label="Slayt Alt Metni"
                                                                            value={slide.subtitle || ''}
                                                                            onChange={(val) => handleSlideChange(idx, 'subtitle', val)}
                                                                        />
                                                                    </div>

                                                                    <div className={styles.formRow} style={{ marginTop: '8px' }}>
                                                                        <div className={styles.formGroup}>
                                                                            <label>Başlık Yazı Rengi</label>
                                                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                                                <input 
                                                                                    type="text" 
                                                                                    value={slide.titleColor || '#ffffff'}
                                                                                    onChange={(e) => handleSlideChange(idx, 'titleColor', e.target.value)}
                                                                                    className={styles.formInput}
                                                                                    placeholder="#HEX veya rgb"
                                                                                    style={{ padding: '8px 12px', fontSize: '13px' }}
                                                                                />
                                                                                <input 
                                                                                    type="color" 
                                                                                    value={slide.titleColor || '#ffffff'}
                                                                                    onChange={(e) => handleSlideChange(idx, 'titleColor', e.target.value)}
                                                                                    style={{ width: '36px', height: '36px', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', padding: 0, flexShrink: 0 }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className={styles.formGroup}>
                                                                            <label>Alt Metin Yazı Rengi</label>
                                                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                                                <input 
                                                                                    type="text" 
                                                                                    value={slide.subtitleColor || '#cbd5e1'}
                                                                                    onChange={(e) => handleSlideChange(idx, 'subtitleColor', e.target.value)}
                                                                                    className={styles.formInput}
                                                                                    placeholder="#HEX veya rgb"
                                                                                    style={{ padding: '8px 12px', fontSize: '13px' }}
                                                                                />
                                                                                <input 
                                                                                    type="color" 
                                                                                    value={slide.subtitleColor || '#cbd5e1'}
                                                                                    onChange={(e) => handleSlideChange(idx, 'subtitleColor', e.target.value)}
                                                                                    style={{ width: '36px', height: '36px', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', padding: 0, flexShrink: 0 }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className={styles.formRow}>
                                                                        <div className={styles.formGroup}>
                                                                            <label>Buton Metni / CTA (İsteğe Bağlı)</label>
                                                                            <input 
                                                                                type="text"
                                                                                value={slide.cta || ''}
                                                                                onChange={(e) => handleSlideChange(idx, 'cta', e.target.value)}
                                                                                className={styles.formInput}
                                                                                placeholder="Örn: Eğitimleri Gör"
                                                                            />
                                                                        </div>
                                                                        {(() => {
                                                                            const defaultPresets = [
                                                                                { label: '🏠 Ana Sayfa', value: '/' },
                                                                                { label: '📚 Tüm Eğitimler', value: '/products' },
                                                                                { label: 'ℹ️ Hakkımızda', value: '/about' },
                                                                                { label: '📞 İletişim', value: '/contact' },
                                                                                { label: '❓ Sıkça Sorulan Sorular (SSS)', value: '/faq' }
                                                                            ]
                                                                            
                                                                            const kurumPresets = (kurumlar || []).map(k => ({
                                                                                label: `🏢 Kurum: ${k.name}`,
                                                                                value: `/products?kurum=${k.slug}`
                                                                            }))
                                                                            
                                                                            const pagePresets = (pages || [])
                                                                                .filter(p => !['home', 'about', 'contact', 'faq'].includes(p.id))
                                                                                .map(p => ({
                                                                                    label: `📄 Sözleşme: ${p.title}`,
                                                                                    value: `/pages/${p.slug}`
                                                                                }))
                                                                                
                                                                            const allPresets = [...defaultPresets, ...kurumPresets, ...pagePresets]
                                                                            const isPreset = allPresets.some(opt => opt.value === slide.link)
                                                                            const selectValue = isPreset ? slide.link : (slide.link ? 'custom' : '')
                                                                            
                                                                            return (
                                                                                <div className={styles.formGroup}>
                                                                                    <label>Buton Yönlendirme Linki (İsteğe Bağlı)</label>
                                                                                    <CustomSelect
                                                                                        value={selectValue}
                                                                                        onChange={(val) => {
                                                                                            if (val === 'custom') {
                                                                                                handleSlideChange(idx, 'link', '')
                                                                                            } else {
                                                                                                handleSlideChange(idx, 'link', val)
                                                                                            }
                                                                                        }}
                                                                                        style={{ marginBottom: selectValue === 'custom' ? '8px' : 0 }}
                                                                                        options={[
                                                                                            { value: '', label: '-- Bağlantı Seçin --' },
                                                                                            { value: 'hdr1', label: 'Sistem Sayfaları', disabled: true },
                                                                                            ...defaultPresets,
                                                                                            ...(kurumPresets.length > 0 ? [{ value: 'hdr2', label: 'Kurum/Bakanlık Sınavları', disabled: true }, ...kurumPresets] : []),
                                                                                            ...(pagePresets.length > 0 ? [{ value: 'hdr3', label: 'Yasal Sözleşmeler & Politikalar', disabled: true }, ...pagePresets] : []),
                                                                                            { value: 'custom', label: '✍️ Özel Bağlantı (Manuel Yazacağım)' }
                                                                                        ]}
                                                                                    />
                                                                                    {selectValue === 'custom' && (
                                                                                        <input 
                                                                                            type="text"
                                                                                            value={slide.link}
                                                                                            onChange={(e) => handleSlideChange(idx, 'link', e.target.value)}
                                                                                            className={styles.formInput}
                                                                                            placeholder="Örn: https://kampanya-sitesi.com veya /ozel-sayfa"
                                                                                        />
                                                                                    )}
                                                                                </div>
                                                                            )
                                                                        })()}
                                                                    </div>

                                                                    <div className={styles.formRow}>
                                                                        <div className={styles.formGroup}>
                                                                            <label>Slayt Simgesi (Lucide Icon)</label>
                                                                            <VisualIconPicker 
                                                                                value={slide.icon || 'none'}
                                                                                onChange={(val) => handleSlideChange(idx, 'icon', val)}
                                                                            />
                                                                        </div>
                                                                        <div className={styles.formGroup} style={{ opacity: (slide.icon === 'none' || !slide.icon) ? 0.4 : 1, pointerEvents: (slide.icon === 'none' || !slide.icon) ? 'none' : 'auto', transition: 'all 0.2s' }}>
                                                                            <label>Simge Rengi</label>
                                                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                                                <input 
                                                                                    type="text" 
                                                                                    value={slide.iconColor || '#3b82f6'}
                                                                                    onChange={(e) => handleSlideChange(idx, 'iconColor', e.target.value)}
                                                                                    className={styles.formInput}
                                                                                    placeholder="#HEX"
                                                                                />
                                                                                <input 
                                                                                    type="color" 
                                                                                    value={slide.iconColor || '#3b82f6'}
                                                                                    onChange={(e) => handleSlideChange(idx, 'iconColor', e.target.value)}
                                                                                    style={{ width: '40px', height: '36px', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className={styles.formGroup} style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                                                            <label style={{ margin: 0 }}>Slayt Arka Plan Görseli</label>
                                                                            <span style={{ fontSize: '10.5px', color: '#64748b', fontWeight: '600' }}>
                                                                                Önerilen: 16:9 Yatay (Örn: 1920x1080) | PNG, JPG, WEBP (Maks. 10MB)
                                                                            </span>
                                                                        </div>
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                                                                            <div style={{ width: '80px', height: '45px', background: '#cbd5e1', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid #94a3b8' }}>
                                                                                {slide.image ? (
                                                                                    <img src={slide.image} alt="Önizleme" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                                ) : (
                                                                                    <ImageIcon size={16} color="#94a3b8" />
                                                                                )}
                                                                            </div>
                                                                            <div style={{ flexGrow: 1, display: 'flex', gap: '8px' }}>
                                                                                <label htmlFor={`file-upload-slide-${idx}`} className={styles.btnSubmit} style={{ margin: 0, padding: '6px 12px', fontSize: '11px', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', boxShadow: 'none', cursor: 'pointer' }}>
                                                                                    Görsel Yükle
                                                                                </label>
                                                                                <input 
                                                                                    id={`file-upload-slide-${idx}`}
                                                                                    type="file"
                                                                                    accept="image/*"
                                                                                    style={{ display: 'none' }}
                                                                                    onChange={(e) => {
                                                                                        const file = e.target.files?.[0]
                                                                                        if (!file) return
                                                                                        if (file.size > 10 * 1024 * 1024) {
                                                                                            triggerConfirm({
                                                                                                title: 'Dosya Çok Büyük',
                                                                                                message: `"${file.name}" çok büyük! Maksimum 10 MB yükleyebilirsiniz.`,
                                                                                                confirmText: 'Tamam',
                                                                                                cancelText: 'Kapat',
                                                                                                isDangerous: true,
                                                                                                onConfirm: () => {}
                                                                                            })
                                                                                            return
                                                                                        }
                                                                                        const reader = new FileReader()
                                                                                        reader.onloadend = async () => {
                                                                                            if (reader.result) {
                                                                                                try {
                                                                                                    const compressed = await compressImage(reader.result as string)
                                                                                                    handleSlideChange(idx, 'image', compressed)
                                                                                                } catch (err) {
                                                                                                    handleSlideChange(idx, 'image', reader.result as string)
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                        reader.readAsDataURL(file)
                                                                                    }}
                                                                                />
                                                                                {slide.image && (
                                                                                    <button 
                                                                                        type="button" 
                                                                                        className={styles.actionDeleteBtn}
                                                                                        onClick={() => handleSlideChange(idx, 'image', '')}
                                                                                        style={{ padding: '4px 10px', fontSize: '11px' }}
                                                                                    >
                                                                                        Kaldır
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        ))}`
                                                    </div>

                                                    <button 
                                                        type="button" 
                                                        onClick={handleAddSlide}
                                                        className={styles.btnSubmit}
                                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                                    >
                                                        <Plus size={16} />
                                                        <span>Yeni Slayt Ekle</span>
                                                    </button>
                                                </div>
                                            )}

                                            {/* SEKME 3: HIZLI YAN KARTLAR */}
                                            {activeHomeTab === 'cta' && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                    <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e293b', textTransform: 'uppercase' }}>Giriş Sağ Yan Kartları (Hızlı Erişim)</h3>
                                                    <p style={{ fontSize: '12px', color: '#64748b', marginTop: '-8px' }}>Hero slaytının hemen sağında yer alan 2 adet öne çıkan hızlı erişim bağlantıları.</p>
                                                    
                                                    {pageForm.ctaPanels && pageForm.ctaPanels.map((panel, pIdx) => (
                                                        <div key={pIdx} className={styles.faqItemRow} style={{ border: '1px solid #cbd5e1', background: '#f8fafc', padding: '16px' }}>
                                                            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#2563eb' }}>KART #{pIdx + 1}: {panel.title || 'Başlıksız Kart'}</span>
                                                            <div className={styles.adminForm} style={{ marginTop: '12px', border: 'none', padding: 0 }}>
                                                                <div className={styles.formRow}>
                                                                    <div className={styles.formGroup}>
                                                                        <label>Kart Başlığı *</label>
                                                                        <input 
                                                                            type="text"
                                                                            required
                                                                            value={panel.title || ''}
                                                                            onChange={(e) => handleCtaCardChange(pIdx, 'title', e.target.value)}
                                                                            className={styles.formInput}
                                                                        />
                                                                    </div>
                                                                    <div className={styles.formGroup}>
                                                                        <label>Kart Alt Metni *</label>
                                                                        <input 
                                                                            type="text"
                                                                            required
                                                                            value={panel.subtitle || ''}
                                                                            onChange={(e) => handleCtaCardChange(pIdx, 'subtitle', e.target.value)}
                                                                            className={styles.formInput}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className={styles.formRow}>
                                                                    <div className={styles.formGroup}>
                                                                        <label>Yönlendirme Linki *</label>
                                                                        <input 
                                                                            type="text"
                                                                            required
                                                                            value={panel.href || ''}
                                                                            onChange={(e) => handleCtaCardChange(pIdx, 'href', e.target.value)}
                                                                            className={styles.formInput}
                                                                        />
                                                                    </div>
                                                                    <div className={styles.formGroup}>
                                                                        <label>Lucide Simgesi *</label>
                                                                        <VisualIconPicker
                                                                            value={panel.icon || 'HelpCircle'}
                                                                            onChange={(val) => handleCtaCardChange(pIdx, 'icon', val)}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className={styles.formGroup}>
                                                                    <label>Arka Plan Gradyan Rengi</label>
                                                                    <CustomSelect
                                                                        value={panel.bgGradient || 'blue'}
                                                                        onChange={(val) => handleCtaCardChange(pIdx, 'bgGradient', val)}
                                                                        options={[
                                                                            { value: 'blue', label: 'Deep Blue (Mavi Gradyan)' },
                                                                            { value: 'purple', label: 'Royal Purple (Mor/Eflatun)' },
                                                                            { value: 'emerald', label: 'Forest Emerald (Zümrüt Yeşil)' },
                                                                            { value: 'orange', label: 'Sunset Orange (Turuncu/Kızıl)' }
                                                                        ]}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* SEKME 4: MODÜLER BÖLÜMLER (YAPBOZ CARDS) */}
                                            {activeHomeTab === 'yapboz' && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                    {/* Homepage Sections Vertical Ordering Manager */}
                                                    <div style={{ background: '#f8fafc', padding: '18px 20px', borderRadius: '12px', border: '2px solid #6366f1', boxShadow: '4px 4px 0px 0px #6366f1', marginBottom: '8px' }}>
                                                        <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                                                            <span>⇅ Ana Sayfa Bölüm Yerleşimi / Sıralaması</span>
                                                        </h4>
                                                        <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '12px' }}>
                                                            Sitedeki bölümlerin yukarıdan aşağıya doğru hangi sıra ile gösterileceğini butonları kullanarak değiştirebilirsiniz.
                                                        </p>
                                                        
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                            {(pageForm.sectionOrder || ['slider', 'featured', 'subcategories', 'yapboz', 'about', 'kurumlar']).map((secKey, idx, arr) => {
                                                                const friendlyNames: Record<string, string> = {
                                                                    slider: '📢 Giriş Slaytları (Slider) & Yan Kartlar',
                                                                    featured: '📚 Öne Çıkan Eğitimler (Ana Sayfa Vitrini)',
                                                                    subcategories: '⚡ Popüler Sınav Grupları (Sınav Hazırlık)',
                                                                    yapboz: '🧩 Dinamik Ekstra Yapboz Bölümleri',
                                                                    about: 'ℹ️ Hakkımızda Kutusu',
                                                                    kurumlar: '🏢 Kurumlar / Bakanlıklar Listesi'
                                                                }
                                                                
                                                                const handleMoveSection = (direction: 'up' | 'down') => {
                                                                    const targetIndex = direction === 'up' ? idx - 1 : idx + 1
                                                                    if (targetIndex < 0 || targetIndex >= arr.length) return
                                                                    const nextOrder = [...arr]
                                                                    const temp = nextOrder[idx]
                                                                    nextOrder[idx] = nextOrder[targetIndex]
                                                                    nextOrder[targetIndex] = temp
                                                                    setPageForm(prev => ({
                                                                        ...prev,
                                                                        sectionOrder: nextOrder
                                                                    }))
                                                                }
                                                                
                                                                return (
                                                                    <div 
                                                                        key={secKey} 
                                                                        style={{ 
                                                                            display: 'flex', 
                                                                            justifyContent: 'space-between', 
                                                                            alignItems: 'center', 
                                                                            padding: '10px 14px', 
                                                                            background: 'white', 
                                                                            borderRadius: '8px', 
                                                                            border: '1.5px solid #e2e8f0', 
                                                                            boxShadow: '0 1px 2px rgba(0,0,0,0.02)' 
                                                                        }}
                                                                    >
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b' }}>
                                                                                {friendlyNames[secKey] || secKey}
                                                                            </span>
                                                                        </div>
                                                                        
                                                                        <div style={{ display: 'flex', gap: '4px' }}>
                                                                            <button 
                                                                                type="button" 
                                                                                onClick={() => handleMoveSection('up')}
                                                                                disabled={idx === 0}
                                                                                style={{ padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', background: idx === 0 ? '#f1f5f9' : 'white', cursor: idx === 0 ? 'not-allowed' : 'pointer', color: '#475569' }}
                                                                            >
                                                                                <ArrowUp size={12} />
                                                                            </button>
                                                                            <button 
                                                                                type="button" 
                                                                                onClick={() => handleMoveSection('down')}
                                                                                disabled={idx === arr.length - 1}
                                                                                style={{ padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', background: idx === arr.length - 1 ? '#f1f5f9' : 'white', cursor: idx === arr.length - 1 ? 'not-allowed' : 'pointer', color: '#475569' }}
                                                                            >
                                                                                <ArrowDown size={12} />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>

                                                    <div style={{ background: '#f1f5f9', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', marginBottom: '8px' }}>
                                                        <h4 style={{ fontSize: '12px', fontWeight: '800', color: '#334155', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase' }}>
                                                            ⚙️ Ana Sayfa Bölüm Görünürlük Ayarları
                                                        </h4>
                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                                                            {renderSwitchToggle(
                                                                'Giriş Slaytları (Slider)', 
                                                                pageForm.activeSections?.slider !== false,
                                                                (val) => handleActiveSectionToggle('slider', val)
                                                            )}
                                                            {renderSwitchToggle(
                                                                'Giriş Yan Kartları', 
                                                                pageForm.activeSections?.ctaPanels !== false,
                                                                (val) => handleActiveSectionToggle('ctaPanels', val)
                                                            )}
                                                            {renderSwitchToggle(
                                                                'Öne Çıkan Eğitimler', 
                                                                pageForm.activeSections?.featured !== false,
                                                                (val) => handleActiveSectionToggle('featured', val)
                                                            )}
                                                            {renderSwitchToggle(
                                                                'Popüler Sınav Grupları', 
                                                                pageForm.activeSections?.subcategories !== false,
                                                                (val) => handleActiveSectionToggle('subcategories', val)
                                                            )}
                                                            {renderSwitchToggle(
                                                                'Kurumlar / Bakanlıklar', 
                                                                pageForm.activeSections?.kurumlar !== false,
                                                                (val) => handleActiveSectionToggle('kurumlar', val)
                                                            )}
                                                            {renderSwitchToggle(
                                                                'Hakkımızda Kutusu', 
                                                                pageForm.activeSections?.about !== false,
                                                                (val) => handleActiveSectionToggle('about', val)
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* 1. ÖNE ÇIKAN EĞİTİMLER PANELİ */}
                                                    {pageForm.activeSections?.featured !== false && (
                                                        <div style={{ background: '#f8fafc', padding: '18px 20px', borderRadius: '12px', border: '1px solid #cbd5e1', marginBottom: '16px' }}>
                                                            <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                                                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', background: '#3b82f6', color: 'white', borderRadius: '6px', fontSize: '11px' }}>1</span>
                                                                <span>Öne Çıkan Eğitimler Yönetimi & Sıralaması</span>
                                                            </h4>
                                                            <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '12px', marginLeft: '30px' }}>
                                                                Ana sayfadaki vitrin kaydırıcısında (slider) gösterilecek eğitimleri seçin ve sıralayın. (Tasarım için 3'ün katı; örn. 3, 6, 9 adet eklemeniz önerilir)
                                                            </p>
                                                            
                                                            <div style={{ marginLeft: '30px', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '250px', overflowY: 'auto', paddingRight: '4px' }}>
                                                                {localProducts.filter(p => p.status !== 'passive').map((product, idx) => {
                                                                    const isFeatured = localFeaturedIds.includes(product.id)
                                                                    const featuredIndex = localProducts.filter(p => localFeaturedIds.includes(p.id)).findIndex(p => p.id === product.id)
                                                                    
                                                                    return (
                                                                        <div 
                                                                            key={product.id} 
                                                                            style={{ 
                                                                                display: 'flex', 
                                                                                justifyContent: 'space-between', 
                                                                                alignItems: 'center', 
                                                                                padding: '10px 14px', 
                                                                                background: isFeatured ? '#f0f9ff' : 'white', 
                                                                                borderRadius: '8px', 
                                                                                border: isFeatured ? '1.5px solid #0284c7' : '1px solid #e2e8f0', 
                                                                                boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                                                                                transition: 'all 0.15s ease'
                                                                            }}
                                                                        >
                                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                                <input 
                                                                                    type="checkbox"
                                                                                    checked={isFeatured}
                                                                                    onChange={() => handleToggleLocalProductFeatured(product.id)}
                                                                                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                                                                />
                                                                                {(() => {
                                                                                    const prodKurum = kurumlar.find(k => k.slug === product.kurumSlug || product.kurumSlugs?.includes(k.slug))
                                                                                    return (
                                                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                                                            <span style={{ fontSize: '12px', fontWeight: '800', color: '#0f172a' }}>
                                                                                                {product.name}
                                                                                            </span>
                                                                                            <span style={{ fontSize: '9px', fontWeight: '700', color: '#64748b' }}>
                                                                                                🏛️ {prodKurum ? prodKurum.name : 'Kurum Yok'}
                                                                                            </span>
                                                                                        </div>
                                                                                    )
                                                                                })()}
                                                                            </div>
                                                                            
                                                                            {isFeatured && (
                                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                                    <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#0369a1', background: '#e0f2fe', padding: '3px 7px', borderRadius: '4px' }}>
                                                                                        Sıra: {featuredIndex + 1}
                                                                                    </span>
                                                                                    <button 
                                                                                        type="button" 
                                                                                        onClick={() => handleMoveLocalProduct(idx, 'up')}
                                                                                        disabled={featuredIndex === 0}
                                                                                        style={{ padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', background: featuredIndex === 0 ? '#f1f5f9' : 'white', cursor: featuredIndex === 0 ? 'not-allowed' : 'pointer', color: '#475569' }}
                                                                                    >
                                                                                        <ArrowUp size={12} />
                                                                                    </button>
                                                                                    <button 
                                                                                        type="button" 
                                                                                        onClick={() => handleMoveLocalProduct(idx, 'down')}
                                                                                        disabled={featuredIndex === localFeaturedIds.length - 1}
                                                                                        style={{ padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', background: featuredIndex === localFeaturedIds.length - 1 ? '#f1f5f9' : 'white', cursor: featuredIndex === localFeaturedIds.length - 1 ? 'not-allowed' : 'pointer', color: '#475569' }}
                                                                                    >
                                                                                        <ArrowDown size={12} />
                                                                                    </button>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* 2. POPÜLER SINAV GRUPLARI PANELİ */}
                                                    {pageForm.activeSections?.subcategories !== false && (
                                                        <div style={{ background: '#f8fafc', padding: '18px 20px', borderRadius: '12px', border: '1px solid #cbd5e1', marginBottom: '16px' }}>
                                                            <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                                                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', background: '#ca8a04', color: 'white', borderRadius: '6px', fontSize: '11px' }}>2</span>
                                                                <span>Popüler Sınav Grupları Yönetimi & Sıralaması</span>
                                                            </h4>
                                                            <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '12px', marginLeft: '30px' }}>
                                                                Ana sayfadaki Popüler Sınav Grupları bölümünde gösterilecek kategorileri seçin ve sıralayın. (Tasarım için çift sayıda; örn. 4, 6, 8 adet eklemeniz önerilir)
                                                            </p>
                                                            
                                                            <div style={{ marginLeft: '30px', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '250px', overflowY: 'auto', paddingRight: '4px' }}>
                                                                {localAltKategoriler.filter(c => c.status !== 'passive').map((cat, idx) => {
                                                                    const isHomepage = cat.showOnHomepage === true
                                                                    const activeIndex = localAltKategoriler.filter(c => c.showOnHomepage).findIndex(c => c.id === cat.id)
                                                                    const parentSlug = cat.kurumSlugs?.[0]
                                                                    const parentKurum = kurumlar.find(k => k.slug === parentSlug)
                                                                    
                                                                    return (
                                                                        <div 
                                                                            key={cat.id} 
                                                                            style={{ 
                                                                                display: 'flex', 
                                                                                justifyContent: 'space-between', 
                                                                                alignItems: 'center', 
                                                                                padding: '10px 14px', 
                                                                                background: isHomepage ? '#fef8ec' : 'white', 
                                                                                borderRadius: '8px', 
                                                                                border: isHomepage ? '1.5px solid #d97706' : '1px solid #e2e8f0', 
                                                                                boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                                                                                transition: 'all 0.15s ease'
                                                                            }}
                                                                        >
                                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                                <input 
                                                                                    type="checkbox"
                                                                                    checked={isHomepage}
                                                                                    onChange={() => handleToggleLocalAltKategoriHomepage(cat.id)}
                                                                                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                                                                />
                                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                                                    <span style={{ fontSize: '12px', fontWeight: '800', color: '#0f172a' }}>
                                                                                        {cat.name}
                                                                                    </span>
                                                                                    {parentKurum && (
                                                                                        <span style={{ fontSize: '9px', fontWeight: '700', color: parentKurum.color || '#6366f1', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                                                                                            🏛️ {parentKurum.name}
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            
                                                                            {isHomepage && (
                                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                                    <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#a16207', background: '#fef3c7', padding: '3px 7px', borderRadius: '4px' }}>
                                                                                        Sıra: {activeIndex + 1}
                                                                                    </span>
                                                                                    <button 
                                                                                        type="button" 
                                                                                        onClick={() => handleMoveLocalAltKategori(idx, 'up')}
                                                                                        disabled={activeIndex === 0}
                                                                                        style={{ padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', background: activeIndex === 0 ? '#f1f5f9' : 'white', cursor: activeIndex === 0 ? 'not-allowed' : 'pointer', color: '#475569' }}
                                                                                    >
                                                                                        <ArrowUp size={12} />
                                                                                    </button>
                                                                                    <button 
                                                                                        type="button" 
                                                                                        onClick={() => handleMoveLocalAltKategori(idx, 'down')}
                                                                                        disabled={activeIndex === localAltKategoriler.filter(c => c.showOnHomepage).length - 1}
                                                                                        style={{ padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', background: activeIndex === localAltKategoriler.filter(c => c.showOnHomepage).length - 1 ? '#f1f5f9' : 'white', cursor: activeIndex === localAltKategoriler.filter(c => c.showOnHomepage).length - 1 ? 'not-allowed' : 'pointer', color: '#475569' }}
                                                                                    >
                                                                                        <ArrowDown size={12} />
                                                                                    </button>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* 3. KURUMLAR / BAKANLIKLAR PANELİ */}
                                                    {pageForm.activeSections?.kurumlar !== false && (
                                                        <div style={{ background: '#f8fafc', padding: '18px 20px', borderRadius: '12px', border: '1px solid #cbd5e1', marginBottom: '16px' }}>
                                                            <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                                                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', background: '#10b981', color: 'white', borderRadius: '6px', fontSize: '11px' }}>3</span>
                                                                <span>Kurumlar / Bakanlıklar Yönetimi & Sıralaması</span>
                                                            </h4>
                                                            <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '12px', marginLeft: '30px' }}>
                                                                Ana sayfadaki Kurumlar/Bakanlıklar bölümünde listelenecek kurumları seçin ve sıralayın.
                                                            </p>
                                                            
                                                            <div style={{ marginLeft: '30px', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '250px', overflowY: 'auto', paddingRight: '4px' }}>
                                                                {localKurumlar.filter(k => k.status !== 'passive').map((kurum, idx) => {
                                                                    const isHomepage = kurum.showOnHomepage !== false
                                                                    
                                                                    return (
                                                                        <div 
                                                                            key={kurum.id} 
                                                                            style={{ 
                                                                                display: 'flex', 
                                                                                justifyContent: 'space-between', 
                                                                                alignItems: 'center', 
                                                                                padding: '10px 14px', 
                                                                                background: isHomepage ? '#f0fdf4' : 'white', 
                                                                                borderRadius: '8px', 
                                                                                border: isHomepage ? '1.5px solid #10b981' : '1px solid #e2e8f0', 
                                                                                boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                                                                                transition: 'all 0.15s ease'
                                                                            }}
                                                                        >
                                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                                <input 
                                                                                    type="checkbox"
                                                                                    checked={isHomepage}
                                                                                    onChange={() => handleToggleLocalKurumHomepage(kurum.id)}
                                                                                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                                                                />
                                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                                                    <span style={{ fontSize: '12px', fontWeight: '800', color: '#0f172a' }}>
                                                                                        {kurum.name}
                                                                                    </span>
                                                                                    <span style={{ fontSize: '9px', fontWeight: '700', color: kurum.color || '#6366f1' }}>
                                                                                        🔑 {kurum.slug}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                            
                                                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                                                <button 
                                                                                    type="button" 
                                                                                    onClick={() => handleMoveLocalKurum(idx, 'up')}
                                                                                    disabled={idx === 0}
                                                                                    style={{ padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', background: idx === 0 ? '#f1f5f9' : 'white', cursor: idx === 0 ? 'not-allowed' : 'pointer', color: '#475569' }}
                                                                                >
                                                                                    <ArrowUp size={12} />
                                                                                </button>
                                                                                <button 
                                                                                    type="button" 
                                                                                    onClick={() => handleMoveLocalKurum(idx, 'down')}
                                                                                    disabled={idx === localKurumlar.filter(k => k.status !== 'passive').length - 1}
                                                                                    style={{ padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', background: idx === localKurumlar.filter(k => k.status !== 'passive').length - 1 ? '#f1f5f9' : 'white', cursor: idx === localKurumlar.filter(k => k.status !== 'passive').length - 1 ? 'not-allowed' : 'pointer', color: '#475569' }}
                                                                                >
                                                                                    <ArrowDown size={12} />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e293b', textTransform: 'uppercase' }}>Dinamik Yapboz Bölümleri ({pageForm.customSections ? pageForm.customSections.length : 0})</h3>
                                                    <p style={{ fontSize: '12px', color: '#64748b', marginTop: '-8px' }}>Ana sayfanın alt tarafına yerleştirebileceğiniz kart listeleri, iki sütunlu tanıtımlar ve tam ekran duyuru bantları.</p>
                                                    
                                                    <div className={styles.faqList}>
                                                        {pageForm.customSections && pageForm.customSections.map((section, sIdx) => (
                                                            <div key={section.id || sIdx} className={styles.faqItemRow} style={{ border: '1px solid #cbd5e1', background: '#f8fafc', padding: '16px' }}>
                                                                <div 
                                                                    className={styles.faqItemHeader}
                                                                    onClick={(e) => {
                                                                        const target = e.target as HTMLElement
                                                                        if (target.closest('button')) return
                                                                        setExpandedSectionIndex(expandedSectionIndex === sIdx ? null : sIdx)
                                                                    }}
                                                                    style={{ cursor: 'pointer', userSelect: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                                                >
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                        <span style={{ fontSize: '11px', color: '#64748b' }}>
                                                                            {expandedSectionIndex === sIdx ? '▼' : '▶'}
                                                                        </span>
                                                                        <span className={styles.faqItemTitle} style={{ color: '#059669', fontWeight: '800' }}>
                                                                            Bölüm #{sIdx + 1}: {section.title || 'Başlıksız Yapboz Bölümü'}
                                                                        </span>
                                                                    </div>
                                                                    
                                                                    <div style={{ display: 'flex', gap: '4px' }}>
                                                                        <button 
                                                                            type="button" 
                                                                            className={styles.starBtn}
                                                                            onClick={() => handleMoveCustomSection(sIdx, 'up')}
                                                                            title="Yukarı Taşı"
                                                                        >
                                                                            <ArrowUp size={12} />
                                                                        </button>
                                                                        <button 
                                                                            type="button" 
                                                                            className={styles.starBtn}
                                                                            onClick={() => handleMoveCustomSection(sIdx, 'down')}
                                                                            title="Aşağı Taşı"
                                                                        >
                                                                            <ArrowDown size={12} />
                                                                        </button>
                                                                        <button 
                                                                            type="button" 
                                                                            className={styles.actionDeleteBtn}
                                                                            onClick={() => handleRemoveCustomSection(sIdx)}
                                                                            title="Bölümü Kaldır"
                                                                            style={{ padding: '4px 8px' }}
                                                                        >
                                                                            <Trash2 size={12} />
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                {expandedSectionIndex === sIdx && (
                                                                    <div className={styles.adminForm} style={{ marginTop: '12px', border: 'none', padding: 0 }}>
                                                                        <div className={styles.formRow}>
                                                                            <div className={styles.formGroup}>
                                                                                <label>Bölüm Başlığı *</label>
                                                                                <input 
                                                                                    type="text"
                                                                                required
                                                                                value={section.title || ''}
                                                                                onChange={(e) => handleCustomSectionChange(sIdx, 'title', e.target.value)}
                                                                                className={styles.formInput}
                                                                            />
                                                                        </div>
                                                                        <div className={styles.formGroup}>
                                                                            <label>Blok Düzeni / Layout *</label>
                                                                            <CustomSelect
                                                                                value={section.layout || 'card'}
                                                                                onChange={(val) => handleCustomSectionChange(sIdx, 'layout', val)}
                                                                                options={[
                                                                                    { value: 'card', label: "Grid Kart Düzeni (3'lü Yan Yana)" },
                                                                                    { value: 'split-left', label: 'İki Sütun: Solda Görsel, Sağda Tanıtım' },
                                                                                    { value: 'split-right', label: 'İki Sütun: Solda Tanıtım, Sağda Görsel' },
                                                                                    { value: 'full-width', label: 'Geniş Duyuru Bandı (Resim / Renk Arka Planlı)' }
                                                                                ]}
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className={styles.formRow}>
                                                                        <div className={styles.formGroup}>
                                                                            <label>İlişkili Simge (Lucide Icon)</label>
                                                                            <VisualIconPicker
                                                                                value={section.icon || 'Award'}
                                                                                onChange={(val) => handleCustomSectionChange(sIdx, 'icon', val)}
                                                                            />
                                                                        </div>
                                                                        <div className={styles.formGroup}>
                                                                            <label>Simge Rengi</label>
                                                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                                                <input 
                                                                                    type="text" 
                                                                                    value={section.iconColor || '#3b82f6'}
                                                                                    onChange={(e) => handleCustomSectionChange(sIdx, 'iconColor', e.target.value)}
                                                                                    className={styles.formInput}
                                                                                />
                                                                                <input 
                                                                                    type="color" 
                                                                                    value={section.iconColor || '#3b82f6'}
                                                                                    onChange={(e) => handleCustomSectionChange(sIdx, 'iconColor', e.target.value)}
                                                                                    style={{ width: '40px', height: '36px', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {['split-left', 'split-right', 'full-width'].includes(section.layout) && (
                                                                        <div className={styles.formGroup} style={{ border: '1px dashed #cbd5e1', padding: '12px', borderRadius: '8px', background: '#fff' }}>
                                                                            <label>Blok Arka Plan Görseli</label>
                                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                                                                                <div style={{ width: '80px', height: '50px', background: '#cbd5e1', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid #94a3b8' }}>
                                                                                    {section.image ? (
                                                                                        <img src={section.image} alt="Önizleme" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                                    ) : (
                                                                                        <ImageIcon size={16} color="#94a3b8" />
                                                                                    )}
                                                                                </div>
                                                                                <div style={{ flexGrow: 1, display: 'flex', gap: '8px' }}>
                                                                                    <label htmlFor={`file-upload-sect-${sIdx}`} className={styles.btnSubmit} style={{ margin: 0, padding: '6px 12px', fontSize: '11px', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', boxShadow: 'none', cursor: 'pointer' }}>
                                                                                        Görsel Yükle
                                                                                    </label>
                                                                                    <input 
                                                                                        id={`file-upload-sect-${sIdx}`}
                                                                                        type="file"
                                                                                        accept="image/*"
                                                                                        style={{ display: 'none' }}
                                                                                        onChange={(e) => {
                                                                                            const file = e.target.files?.[0]
                                                                                            if (!file) return
                                                                                            if (file.size > 10 * 1024 * 1024) {
                                                                                                triggerConfirm({
                                                                                                    title: 'Dosya Çok Büyük',
                                                                                                    message: `"${file.name}" çok büyük! Maksimum 10 MB yükleyebilirsiniz.`,
                                                                                                    confirmText: 'Tamam',
                                                                                                    cancelText: 'Kapat',
                                                                                                    isDangerous: true,
                                                                                                    onConfirm: () => {}
                                                                                                })
                                                                                                return
                                                                                            }
                                                                                            const reader = new FileReader()
                                                                                            reader.onloadend = async () => {
                                                                                                if (reader.result) {
                                                                                                    try {
                                                                                                        const compressed = await compressImage(reader.result as string)
                                                                                                        handleCustomSectionChange(sIdx, 'image', compressed)
                                                                                                    } catch (err) {
                                                                                                        handleCustomSectionChange(sIdx, 'image', reader.result as string)
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                            reader.readAsDataURL(file)
                                                                                        }}
                                                                                    />
                                                                                    {section.image && (
                                                                                        <button 
                                                                                            type="button" 
                                                                                            className={styles.actionDeleteBtn}
                                                                                            onClick={() => handleCustomSectionChange(sIdx, 'image', '')}
                                                                                            style={{ padding: '4px 10px', fontSize: '11px' }}
                                                                                        >
                                                                                            Kaldır
                                                                                        </button>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    <div className={styles.formRow}>
                                                                        <div className={styles.formGroup}>
                                                                            <label>Harekete Geçirici Buton Yazısı</label>
                                                                            <input 
                                                                                type="text"
                                                                                value={section.buttonText || ''}
                                                                                onChange={(e) => handleCustomSectionChange(sIdx, 'buttonText', e.target.value)}
                                                                                className={styles.formInput}
                                                                                placeholder="Örn: Eğitimleri Keşfet (İsteğe Bağlı)"
                                                                            />
                                                                        </div>
                                                                        <div className={styles.formGroup}>
                                                                            <label>Buton Yönlendirme Linki</label>
                                                                            <input 
                                                                                type="text"
                                                                                value={section.buttonLink || ''}
                                                                                onChange={(e) => handleCustomSectionChange(sIdx, 'buttonLink', e.target.value)}
                                                                                className={styles.formInput}
                                                                                placeholder="Örn: /products"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className={styles.formGroup}>
                                                                        <label>Bölüm Detaylı İçeriği / Açıklaması *</label>
                                                                        {renderToolbar(`custom-section-content-${sIdx}`, `customSections[${sIdx}].content`)}
                                                                        <textarea 
                                                                            id={`custom-section-content-${sIdx}`}
                                                                            required
                                                                            value={section.content || ''}
                                                                            onChange={(e) => handleCustomSectionChange(sIdx, 'content', e.target.value)}
                                                                            className={styles.formTextarea}
                                                                            style={{ minHeight: '100px' }}
                                                                            placeholder="Bu bölüme ait tüm tanıtım veya kampanya yazılarını kurumsal olarak detaylandırın..."
                                                                        />
                                                                    </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}`
                                                    </div>

                                                    <button 
                                                        type="button" 
                                                        onClick={handleAddCustomSection}
                                                        className={styles.btnSubmit}
                                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                                    >
                                                        <Plus size={16} />
                                                        <span>Yeni Yapboz Bölümü Ekle</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Tab Content: About tab controls */}
                                    {editingPage.id === 'about' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            <div className={styles.formRow}>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="page-title">Sayfa Başlığı *</label>
                                                    <input 
                                                        id="page-title"
                                                        type="text"
                                                        required
                                                        value={pageForm.title}
                                                        onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })}
                                                        className={styles.formInput}
                                                    />
                                                </div>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="page-status">Yayın Durumu *</label>
                                                    <CustomSelect
                                                        id="page-status"
                                                        value={pageForm.status}
                                                        onChange={(val) => setPageForm({ ...pageForm, status: val as 'published' | 'draft' })}
                                                        options={[
                                                            { value: 'published', label: "Yayında (Menü & Footer'da Gösterilir)" },
                                                            { value: 'draft', label: 'Taslak (Ziyaretçilere Gizlenir)' }
                                                        ]}
                                                    />
                                                </div>
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label htmlFor="about-text">Kurumsal Hakkımızda Metni *</label>
                                                {renderToolbar('about-text', 'aboutText')}
                                                <textarea 
                                                    id="about-text"
                                                    required
                                                    value={pageForm.aboutText || ''}
                                                    onChange={(e) => setPageForm({ ...pageForm, aboutText: e.target.value })}
                                                    className={styles.formTextarea}
                                                    style={{ minHeight: '100px' }}
                                                />
                                            </div>

                                            <div className={styles.formRow}>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="about-vision">Vizyonumuz *</label>
                                                    {renderToolbar('about-vision', 'aboutVision')}
                                                    <textarea 
                                                        id="about-vision"
                                                        required
                                                        value={pageForm.aboutVision || ''}
                                                        onChange={(e) => setPageForm({ ...pageForm, aboutVision: e.target.value })}
                                                        className={styles.formTextarea}
                                                        style={{ minHeight: '80px' }}
                                                    />
                                                </div>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="about-mission">Misyonumuz *</label>
                                                    {renderToolbar('about-mission', 'aboutMission')}
                                                    <textarea 
                                                        id="about-mission"
                                                        required
                                                        value={pageForm.aboutMission || ''}
                                                        onChange={(e) => setPageForm({ ...pageForm, aboutMission: e.target.value })}
                                                        className={styles.formTextarea}
                                                        style={{ minHeight: '80px' }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Alternating split sections list for About page */}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                                                <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e293b', textTransform: 'uppercase' }}>Dinamik Ekstra Bölümler ({pageForm.customSections ? pageForm.customSections.length : 0})</h3>
                                                
                                                <div className={styles.faqList}>
                                                    {pageForm.customSections && pageForm.customSections.map((section, sIdx) => (
                                                        <div key={section.id || sIdx} className={styles.faqItemRow} style={{ border: '1px solid #cbd5e1', background: '#f8fafc', padding: '16px' }}>
                                                            <div className={styles.faqItemHeader}>
                                                                <span className={styles.faqItemTitle} style={{ color: '#059669', fontWeight: '800' }}>
                                                                    Bölüm #{sIdx + 1}: {section.title || 'Başlıksız Bölüm'}
                                                                </span>
                                                                <div style={{ display: 'flex', gap: '4px' }}>
                                                                    <button 
                                                                        type="button" 
                                                                        className={styles.starBtn}
                                                                        onClick={() => handleMoveCustomSection(sIdx, 'up')}
                                                                        title="Yukarı Taşı"
                                                                    >
                                                                        <ArrowUp size={12} />
                                                                    </button>
                                                                    <button 
                                                                        type="button" 
                                                                        className={styles.starBtn}
                                                                        onClick={() => handleMoveCustomSection(sIdx, 'down')}
                                                                        title="Aşağı Taşı"
                                                                    >
                                                                        <ArrowDown size={12} />
                                                                    </button>
                                                                    <button 
                                                                        type="button" 
                                                                        className={styles.actionDeleteBtn}
                                                                        onClick={() => handleRemoveCustomSection(sIdx)}
                                                                        title="Bölümü Kaldır"
                                                                        style={{ padding: '4px 8px' }}
                                                                    >
                                                                        <Trash2 size={12} />
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <div className={styles.adminForm} style={{ marginTop: '12px', border: 'none', padding: 0 }}>
                                                                <div className={styles.formRow}>
                                                                    <div className={styles.formGroup}>
                                                                        <label>Bölüm Başlığı *</label>
                                                                        <input 
                                                                            type="text"
                                                                            required
                                                                            value={section.title || ''}
                                                                            onChange={(e) => handleCustomSectionChange(sIdx, 'title', e.target.value)}
                                                                            className={styles.formInput}
                                                                        />
                                                                    </div>
                                                                    <div className={styles.formGroup}>
                                                                        <label>Blok Düzeni / Layout *</label>
                                                                        <CustomSelect
                                                                            value={section.layout || 'split-left'}
                                                                            onChange={(val) => handleCustomSectionChange(sIdx, 'layout', val)}
                                                                            options={[
                                                                                { value: 'split-left', label: 'İki Sütun: Solda Görsel, Sağda Tanıtım' },
                                                                                { value: 'split-right', label: 'İki Sütun: Solda Tanıtım, Sağda Görsel' },
                                                                                { value: 'card', label: "Grid Kart Düzeni (3'lü Yan Yana)" },
                                                                                { value: 'full-width', label: 'Geniş Duyuru Bandı (Resim / Renk Arka Planlı)' }
                                                                            ]}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className={styles.formRow}>
                                                                    <div className={styles.formGroup}>
                                                                        <label>İlişkili Simge (Lucide Icon)</label>
                                                                        <VisualIconPicker
                                                                            value={section.icon || 'Award'}
                                                                            onChange={(val) => handleCustomSectionChange(sIdx, 'icon', val)}
                                                                        />
                                                                    </div>
                                                                    <div className={styles.formGroup}>
                                                                        <label>Simge Rengi</label>
                                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                                            <input 
                                                                                type="text" 
                                                                                value={section.iconColor || '#3b82f6'}
                                                                                onChange={(e) => handleCustomSectionChange(sIdx, 'iconColor', e.target.value)}
                                                                                className={styles.formInput}
                                                                            />
                                                                            <input 
                                                                                type="color" 
                                                                                value={section.iconColor || '#3b82f6'}
                                                                                onChange={(e) => handleCustomSectionChange(sIdx, 'iconColor', e.target.value)}
                                                                                style={{ width: '40px', height: '36px', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {['split-left', 'split-right', 'full-width'].includes(section.layout) && (
                                                                    <div className={styles.formGroup} style={{ border: '1px dashed #cbd5e1', padding: '12px', borderRadius: '8px', background: '#fff' }}>
                                                                        <label>Blok Arka Plan Görseli</label>
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                                                                            <div style={{ width: '80px', height: '50px', background: '#cbd5e1', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid #94a3b8' }}>
                                                                                {section.image ? (
                                                                                    <img src={section.image} alt="Önizleme" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                                ) : (
                                                                                    <ImageIcon size={16} color="#94a3b8" />
                                                                                )}
                                                                            </div>
                                                                            <div style={{ flexGrow: 1, display: 'flex', gap: '8px' }}>
                                                                                <label htmlFor={`file-upload-about-sect-${sIdx}`} className={styles.btnSubmit} style={{ margin: 0, padding: '6px 12px', fontSize: '11px', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', boxShadow: 'none', cursor: 'pointer' }}>
                                                                                    Görsel Yükle
                                                                                </label>
                                                                                <input 
                                                                                    id={`file-upload-about-sect-${sIdx}`}
                                                                                    type="file"
                                                                                    accept="image/*"
                                                                                    style={{ display: 'none' }}
                                                                                    onChange={(e) => {
                                                                                        const file = e.target.files?.[0]
                                                                                        if (!file) return
                                                                                        if (file.size > 10 * 1024 * 1024) {
                                                                                            triggerConfirm({
                                                                                                title: 'Dosya Çok Büyük',
                                                                                                message: `"${file.name}" çok büyük! Maksimum 10 MB yükleyebilirsiniz.`,
                                                                                                confirmText: 'Tamam',
                                                                                                cancelText: 'Kapat',
                                                                                                isDangerous: true,
                                                                                                onConfirm: () => {}
                                                                                            })
                                                                                            return
                                                                                        }
                                                                                        const reader = new FileReader()
                                                                                        reader.onloadend = async () => {
                                                                                            if (reader.result) {
                                                                                                try {
                                                                                                    const compressed = await compressImage(reader.result as string)
                                                                                                    handleCustomSectionChange(sIdx, 'image', compressed)
                                                                                                } catch (err) {
                                                                                                    handleCustomSectionChange(sIdx, 'image', reader.result as string)
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                        reader.readAsDataURL(file)
                                                                                    }}
                                                                                />
                                                                                {section.image && (
                                                                                    <button 
                                                                                        type="button" 
                                                                                        className={styles.actionDeleteBtn}
                                                                                        onClick={() => handleCustomSectionChange(sIdx, 'image', '')}
                                                                                        style={{ padding: '4px 10px', fontSize: '11px' }}
                                                                                    >
                                                                                        Kaldır
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                <div className={styles.formRow}>
                                                                    <div className={styles.formGroup}>
                                                                        <label>Buton Yazısı (Örn: Keşfet)</label>
                                                                        <input 
                                                                            type="text"
                                                                            value={section.buttonText || ''}
                                                                            onChange={(e) => handleCustomSectionChange(sIdx, 'buttonText', e.target.value)}
                                                                            className={styles.formInput}
                                                                        />
                                                                    </div>
                                                                    <div className={styles.formGroup}>
                                                                        <label>Buton Yönlendirme Linki (Örn: /products)</label>
                                                                        <input 
                                                                            type="text"
                                                                            value={section.buttonLink || ''}
                                                                            onChange={(e) => handleCustomSectionChange(sIdx, 'buttonLink', e.target.value)}
                                                                            className={styles.formInput}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className={styles.formGroup}>
                                                                    <label>Bölüm Detaylı İçeriği / Açıklaması *</label>
                                                                    {renderToolbar(`about-section-content-${sIdx}`, `customSections[${sIdx}].content`)}
                                                                    <textarea 
                                                                        id={`about-section-content-${sIdx}`}
                                                                        required
                                                                        value={section.content || ''}
                                                                        onChange={(e) => handleCustomSectionChange(sIdx, 'content', e.target.value)}
                                                                        className={styles.formTextarea}
                                                                        style={{ minHeight: '100px' }}
                                                                        placeholder="Bu bölüme ait tüm tanıtım yazılarını girin..."
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <button 
                                                    type="button" 
                                                    onClick={handleAddCustomSection}
                                                    className={styles.btnSubmit}
                                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                                >
                                                    <Plus size={16} />
                                                    <span>Yeni Yapboz Bölümü Ekle</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Tab Content: Contact tab controls */}
                                    {editingPage.id === 'contact' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            <div className={styles.formRow}>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="page-title">Sayfa Başlığı *</label>
                                                    <input 
                                                        id="page-title"
                                                        type="text"
                                                        required
                                                        value={pageForm.title}
                                                        onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })}
                                                        className={styles.formInput}
                                                    />
                                                </div>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="page-status">Yayın Durumu *</label>
                                                    <CustomSelect
                                                        id="page-status"
                                                        value={pageForm.status}
                                                        onChange={(val) => setPageForm({ ...pageForm, status: val as 'published' | 'draft' })}
                                                        options={[
                                                            { value: 'published', label: "Yayında (Menü & Footer'da Gösterilir)" },
                                                            { value: 'draft', label: 'Taslak (Ziyaretçilere Gizlenir)' }
                                                        ]}
                                                    />
                                                </div>
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label htmlFor="contact-phone">İletişim Telefonu *</label>
                                                <input 
                                                    id="contact-phone"
                                                    type="text"
                                                    required
                                                    value={pageForm.phone || ''}
                                                    onChange={(e) => setPageForm({ ...pageForm, phone: e.target.value })}
                                                    className={styles.formInput}
                                                />
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label htmlFor="contact-email">İletişim E-posta Adresi *</label>
                                                <input 
                                                    id="contact-email"
                                                    type="email"
                                                    required
                                                    value={pageForm.email || ''}
                                                    onChange={(e) => setPageForm({ ...pageForm, email: e.target.value })}
                                                    className={styles.formInput}
                                                />
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label htmlFor="contact-whatsapp">WhatsApp Destek Hattı *</label>
                                                <input 
                                                    id="contact-whatsapp"
                                                    type="text"
                                                    required
                                                    value={pageForm.whatsapp || ''}
                                                    onChange={(e) => setPageForm({ ...pageForm, whatsapp: e.target.value })}
                                                    className={styles.formInput}
                                                />
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label htmlFor="contact-address">Kurumsal Ofis Adresi *</label>
                                                <textarea 
                                                    id="contact-address"
                                                    required
                                                    value={pageForm.address || ''}
                                                    onChange={(e) => setPageForm({ ...pageForm, address: e.target.value })}
                                                    className={styles.formTextarea}
                                                    style={{ minHeight: '80px' }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Tab Content: FAQ tab controls */}
                                    {editingPage.id === 'faq' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            <div className={styles.formRow}>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="page-title">Sayfa Başlığı *</label>
                                                    <input 
                                                        id="page-title"
                                                        type="text"
                                                        required
                                                        value={pageForm.title}
                                                        onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })}
                                                        className={styles.formInput}
                                                    />
                                                </div>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="page-status">Yayın Durumu *</label>
                                                    <CustomSelect
                                                        id="page-status"
                                                        value={pageForm.status}
                                                        onChange={(val) => setPageForm({ ...pageForm, status: val as 'published' | 'draft' })}
                                                        options={[
                                                            { value: 'published', label: "Yayında (Menü & Footer'da Gösterilir)" },
                                                            { value: 'draft', label: 'Taslak (Ziyaretçilere Gizlenir)' }
                                                        ]}
                                                    />
                                                </div>
                                            </div>

                                            <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e293b', textTransform: 'uppercase', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>Soru-Cevap Listesi Yöneticisi ({pageForm.faqs ? pageForm.faqs.length : 0})</h3>
                                            
                                            <div className={styles.faqList}>
                                                {pageForm.faqs && pageForm.faqs.map((faq, index) => (
                                                    <div key={faq.id || index} className={styles.faqItemRow}>
                                                        <div className={styles.faqItemHeader}>
                                                            <span className={styles.faqItemTitle}>Soru #{index + 1}</span>
                                                            <button 
                                                                type="button" 
                                                                className={styles.actionDeleteBtn}
                                                                onClick={() => handleRemoveFaqItem(index)}
                                                                title="Soruyu Sil"
                                                                style={{ padding: '4px 8px' }}
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                        </div>
                                                        <div className={styles.adminForm} style={{ marginTop: '10px', border: 'none', padding: 0 }}>
                                                            <div className={styles.formGroup}>
                                                                <label>Soru Metni *</label>
                                                                <input 
                                                                    type="text" 
                                                                    required
                                                                    value={faq.q}
                                                                    onChange={(e) => handleFaqItemChange(index, 'q', e.target.value)}
                                                                    className={styles.formInput}
                                                                    placeholder="Örn: Video derslerin geçerlilik süresi ne kadardır?"
                                                                />
                                                            </div>
                                                            <div className={styles.formGroup}>
                                                                <label>Cevap Metni *</label>
                                                                {renderToolbar(`faq-answer-${index}`, `faqs[${index}].a`)}
                                                                <textarea 
                                                                    id={`faq-answer-${index}`}
                                                                    required
                                                                    value={faq.a}
                                                                    onChange={(e) => handleFaqItemChange(index, 'a', e.target.value)}
                                                                    className={styles.formTextarea}
                                                                    style={{ minHeight: '80px' }}
                                                                    placeholder="Örn: Satın aldığınız video eğitim paketleri aktivasyon tarihinden itibaren 1 yıl (365 gün) boyunca kesintisiz erişiminize açık kalır."
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <button 
                                                type="button" 
                                                onClick={handleAddFaqItem}
                                                className={styles.btnSubmit}
                                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                            >
                                                <Plus size={16} />
                                                <span>Yeni Soru-Cevap Ekle</span>
                                            </button>
                                        </div>
                                    )}

                                    {/* Tab Content: Legal template editors */}
                                    {!['home', 'about', 'contact', 'faq'].includes(editingPage.id) && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            <div className={styles.formRow}>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="page-title">{editingPage.id.startsWith('custom_') ? 'Özel Sayfa Başlığı *' : 'Yasal Sayfa Başlığı *'}</label>
                                                    <input 
                                                        id="page-title"
                                                        type="text"
                                                        required
                                                        value={pageForm.title}
                                                        onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })}
                                                        className={styles.formInput}
                                                    />
                                                </div>
                                                {editingPage.id.startsWith('custom_') && (
                                                    <div className={styles.formGroup}>
                                                        <label htmlFor="page-slug">Sayfa Linki (URL Slug) (Boş bırakırsanız başlıktan türetilir)</label>
                                                        <input 
                                                            id="page-slug"
                                                            type="text"
                                                            value={pageForm.slug || ''}
                                                            onChange={(e) => setPageForm({ ...pageForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                                            className={styles.formInput}
                                                            placeholder="Örn: kara-cuma-kampanyasi"
                                                        />
                                                    </div>
                                                )}
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="page-status">Yayın Durumu *</label>
                                                    <CustomSelect
                                                        id="page-status"
                                                        value={pageForm.status}
                                                        onChange={(val) => setPageForm({ ...pageForm, status: val as 'published' | 'draft' })}
                                                        options={[
                                                            { value: 'published', label: "Yayında (Menü & Footer'da Gösterilir)" },
                                                            { value: 'draft', label: 'Taslak (Ziyaretçilere Gizlenir)' }
                                                        ]}
                                                    />
                                                </div>
                                            </div>

                                            <div className={styles.formGroup} style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                                                <label>Sözleşme/Hukuki Metin Editörü (HTML formatında)</label>
                                                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
                                                    <button type="button" onClick={() => insertHtmlTag('<h2>', '</h2>')} className={styles.wysiwygBtn} title="Ana Başlık (h2)">
                                                        <Heading size={13} /> H2
                                                    </button>
                                                    <button type="button" onClick={() => insertHtmlTag('<h3>', '</h3>')} className={styles.wysiwygBtn} title="Alt Başlık (h3)">
                                                        <Heading size={11} /> H3
                                                    </button>
                                                    <button type="button" onClick={() => insertHtmlTag('<p>', '</p>')} className={styles.wysiwygBtn} title="Paragraf (p)">
                                                        Paragraf
                                                    </button>
                                                    <button type="button" onClick={() => insertHtmlTag('<strong>', '</strong>')} className={styles.wysiwygBtn} title="Kalın (strong)">
                                                        <Bold size={13} />
                                                    </button>
                                                    <button type="button" onClick={() => insertHtmlTag('<em>', '</em>')} className={styles.wysiwygBtn} title="İtalik (em)">
                                                        <Italic size={13} />
                                                    </button>
                                                    <button type="button" onClick={() => insertHtmlTag('<u>', '</u>')} className={styles.wysiwygBtn} title="Altı Çizili (u)">
                                                        <Underline size={13} />
                                                    </button>
                                                    <button type="button" onClick={() => insertHtmlTag('<ul>\n  <li>', '</li>\n</ul>')} className={styles.wysiwygBtn} title="Sırasız Liste (ul)">
                                                        <List size={13} />
                                                    </button>
                                                    <button type="button" onClick={() => insertHtmlTag('<ol>\n  <li>', '</li>\n</ol>')} className={styles.wysiwygBtn} title="Sıralı Liste (ol)">
                                                        <ListOrdered size={13} />
                                                    </button>
                                                    <button type="button" onClick={() => insertHtmlTag('<code>', '</code>')} className={styles.wysiwygBtn} title="Kod Bloğu">
                                                        <Code size={13} />
                                                    </button>
                                                    <button type="button" onClick={() => insertHtmlTag('<a href="#" target="_blank">', '</a>')} className={styles.wysiwygBtn} title="Bağlantı Ekle (a)">
                                                        <LinkIcon size={13} />
                                                    </button>
                                                    <button type="button" onClick={() => insertHtmlTag('<blockquote>', '</blockquote>')} className={styles.wysiwygBtn} title="Alıntı (blockquote)">
                                                        <Quote size={13} />
                                                    </button>
                                                    <button type="button" onClick={() => insertHtmlTag('<br />')} className={styles.wysiwygBtn} title="Satır Atla">
                                                        ↵ Boşluk
                                                    </button>
                                                </div>
                                            </div>

                                            <div className={styles.formGroup}>
                                                <textarea 
                                                    id="page-content-textarea"
                                                    value={pageForm.content || ''}
                                                    onChange={(e) => setPageForm({ ...pageForm, content: e.target.value })}
                                                    className={`${styles.formTextarea} ${styles.wysiwygTextarea}`}
                                                    style={{ minHeight: '300px' }}
                                                    placeholder="Sözleşme veya politika kurallarını HTML tagları ile kurumsal olarak yazın..."
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                        </div>

                        {/* RIGHT COLUMN: PREMIUM DEVICE LIVE PREVIEW EMULATOR */}
                        {isWidescreenMode && (
                            <div className={styles.previewPane} style={{ 
                                flex: '0.8',
                                width: '40%',
                                background: '#0f172a', 
                                backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)',
                                backgroundSize: '20px 20px',
                                padding: '24px', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                height: '100%', 
                                overflow: 'hidden' 
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                                    <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#f8fafc', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span>Canlı Web Tarayıcı Önizlemesi</span>
                                    </h3>
                                    
                                    {/* Desktop / Mobile Selector Toggle */}
                                    <div className={styles.viewportToggleBar}>
                                        <button 
                                            type="button" 
                                            className={`${styles.viewportToggleBtn} ${previewMode === 'desktop' ? styles.viewportToggleBtnActive : ''}`}
                                            onClick={() => setPreviewMode('desktop')}
                                        >
                                            🖥️ Masaüstü
                                        </button>
                                        <button 
                                            type="button" 
                                            className={`${styles.viewportToggleBtn} ${previewMode === 'mobile' ? styles.viewportToggleBtnActive : ''}`}
                                            onClick={() => setPreviewMode('mobile')}
                                        >
                                            📱 Mobil
                                        </button>
                                    </div>
                                </div>
                                
                                <div 
                                    className={`${styles.deviceMockup} ${styles.deviceMockupTransition} ${previewMode === 'mobile' ? styles.deviceMockupMobile : ''}`} 
                                    style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '3px solid #0f172a', borderRadius: '12px', background: '#fff', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' }}
                                >
                                    {/* Mockup macOS Topbar Window Controls */}
                                    <div style={{ height: '36px', background: '#e2e8f0', borderBottom: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', padding: '0 12px', justifyContent: 'space-between', flexShrink: 0 }}>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
                                            {previewMode === 'desktop' && (
                                                <>
                                                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
                                                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                                                </>
                                            )}
                                        </div>
                                        
                                        {/* SSL Address Bar Mockup */}
                                        <div style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '9px', padding: '3px 12px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'monospace', width: previewMode === 'mobile' ? '65%' : '50%', justifyContent: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            <span style={{ color: '#10b981' }}>🔒</span>
                                            <span>mevzuatadam.com/{editingPage.slug === 'home' ? '' : editingPage.slug}</span>
                                        </div>
                                        
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                                            {previewMode === 'desktop' && (
                                                <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.02em' }}>CANLI</span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Mockup Header Navigation */}
                                    <div style={{ height: '40px', background: '#fff', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', padding: '0 12px', justifyContent: 'space-between', flexShrink: 0 }}>
                                        <span style={{ fontSize: '10px', fontWeight: '900', color: '#0f172a', letterSpacing: '0.05em' }}>📘 MEVZUAT ADAM</span>
                                        {previewMode === 'mobile' ? (
                                            <span style={{ fontSize: '12px', cursor: 'pointer', fontWeight: 'bold', color: '#0f172a', padding: '4px' }}>☰</span>
                                        ) : (
                                            <div style={{ display: 'flex', gap: '8px', fontSize: '8px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>
                                                <span style={{ color: editingPage.id === 'home' ? '#2563eb' : '#64748b' }}>Ana Sayfa</span>
                                                <span>Eğitimler</span>
                                                <span style={{ color: editingPage.id === 'about' ? '#2563eb' : '#64748b' }}>Hakkımızda</span>
                                                <span>İletişim</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Scrollable Page Body Mockup */}
                                    <div className={styles.previewPaneContent} style={{ padding: '16px', overflowY: 'auto', flexGrow: 1, maxHeight: 'calc(85vh - 180px)' }}>
                                        {editingPage.id === 'home' && (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                                {/* 1. Announcement Preview */}
                                                <div>
                                                    <span className={styles.previewSectionLabel}>Duyuru Bandı</span>
                                                    {pageForm.showAnnouncement && (pageForm.announcementText || pageForm.announcementImage) ? (
                                                        <div 
                                                            style={pageForm.announcementType === 'image' ? {
                                                                padding: 0,
                                                                background: 'transparent',
                                                                borderRadius: '8px',
                                                                overflow: 'hidden',
                                                                border: '1px solid #cbd5e1',
                                                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                                                lineHeight: 0
                                                            } : { 
                                                                background: pageForm.announcementBg || 'linear-gradient(90deg, #ef4444 0%, #f97316 100%)',
                                                                padding: '8px 12px',
                                                                color: 'white',
                                                                fontSize: '11px',
                                                                textAlign: 'center',
                                                                borderRadius: '8px',
                                                                fontWeight: 'bold',
                                                                border: '1px solid rgba(255,255,255,0.1)',
                                                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                gap: '8px'
                                                            }}
                                                        >
                                                            {pageForm.announcementType === 'image' && pageForm.announcementImage ? (
                                                                <img src={pageForm.announcementImage} alt="Duyuru Görseli" style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '40px', objectFit: 'cover' }} />
                                                            ) : (
                                                                <span>📢 {pageForm.announcementText}</span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className={styles.previewEmptyState}>Duyuru bandı aktif değil.</div>
                                                    )}
                                                </div>

                                                {/* 2. Hero Carousel Mockup */}
                                                <div>
                                                    <span className={styles.previewSectionLabel}>Giriş Slaytları (Slider)</span>
                                                    {pageForm.slides && pageForm.slides.length > 0 ? (
                                                        <div style={{ position: 'relative', height: '170px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #0f172a', color: 'white', display: 'flex', alignItems: 'center', padding: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
                                                            {/* Background Graphic */}
                                                            <div 
                                                                style={pageForm.slides[activePreviewSlideIndex]?.image ? {
                                                                    backgroundImage: `url(${pageForm.slides[activePreviewSlideIndex].image})`,
                                                                    backgroundSize: 'cover',
                                                                    backgroundPosition: 'center',
                                                                    position: 'absolute',
                                                                    inset: 0,
                                                                    zIndex: 0
                                                                } : {
                                                                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                                                                    position: 'absolute',
                                                                    inset: 0,
                                                                    zIndex: 0
                                                                }}
                                                            />
                                                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.6)', zIndex: 1 }} />
                                                            
                                                            {/* Miniature Slider Swiper Navigation Controls */}
                                                            {pageForm.slides.length > 1 && (
                                                                <div className={styles.miniatureSliderArrows}>
                                                                    <button 
                                                                        type="button" 
                                                                        className={styles.miniatureSliderArrowBtn}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setActivePreviewSlideIndex(prev => (prev === 0 ? pageForm.slides.length - 1 : prev - 1));
                                                                        }}
                                                                    >
                                                                        ‹
                                                                    </button>
                                                                    <button 
                                                                        type="button" 
                                                                        className={styles.miniatureSliderArrowBtn}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setActivePreviewSlideIndex(prev => (prev === pageForm.slides.length - 1 ? 0 : prev + 1));
                                                                        }}
                                                                    >
                                                                        ›
                                                                    </button>
                                                                </div>
                                                            )}
                                                            
                                                            <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '80%' }}>
                                                                {pageForm.slides[activePreviewSlideIndex]?.icon && pageForm.slides[activePreviewSlideIndex]?.icon !== 'none' && (
                                                                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px', borderRadius: '6px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                                                                        <DynamicIcon name={pageForm.slides[activePreviewSlideIndex]?.icon} size={16} color={pageForm.slides[activePreviewSlideIndex]?.iconColor || '#fff'} />
                                                                    </div>
                                                                )}
                                                                <h4 
                                                                    style={{ 
                                                                        fontSize: '12px', 
                                                                        fontWeight: '900', 
                                                                        letterSpacing: '0.01em', 
                                                                        marginTop: '4px',
                                                                        color: pageForm.slides[activePreviewSlideIndex]?.titleColor || '#ffffff'
                                                                    }}
                                                                    dangerouslySetInnerHTML={{ __html: pageForm.slides[activePreviewSlideIndex]?.title || 'Yeni Slayt' }}
                                                                />
                                                                <p 
                                                                    style={{ 
                                                                        fontSize: '8px', 
                                                                        opacity: 0.8, 
                                                                        lineHeight: 1.3,
                                                                        color: pageForm.slides[activePreviewSlideIndex]?.subtitleColor || '#cbd5e1'
                                                                    }}
                                                                    dangerouslySetInnerHTML={{ __html: pageForm.slides[activePreviewSlideIndex]?.subtitle || 'Slayt açıklama metni...' }}
                                                                />
                                                                {pageForm.slides[activePreviewSlideIndex]?.cta && (
                                                                    <div style={{ marginTop: '2px' }}>
                                                                        <span style={{ fontSize: '8px', fontWeight: 'bold', background: 'var(--color-accent, #eab308)', color: '#000', padding: '3px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>
                                                                            {pageForm.slides[activePreviewSlideIndex]?.cta}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Miniature Mockup Slider Dot Indicators */}
                                                            <div style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '4px', zIndex: 3 }}>
                                                                {pageForm.slides.map((_, idx) => (
                                                                    <button 
                                                                        key={idx} 
                                                                        type="button"
                                                                        onClick={() => setActivePreviewSlideIndex(idx)}
                                                                        style={{ width: '5px', height: '5px', borderRadius: '50%', background: idx === activePreviewSlideIndex ? '#fff' : 'rgba(255,255,255,0.4)', border: 'none', cursor: 'pointer', padding: 0 }}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className={styles.previewEmptyState}>Slayt bulunamadı.</div>
                                                    )}
                                                </div>

                                                {/* 3. CTA Panels Mockup */}
                                                <div>
                                                    <span className={styles.previewSectionLabel}>Hızlı Yan Kartlar</span>
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                                        {pageForm.ctaPanels && pageForm.ctaPanels.map((panel, idx) => (
                                                            <div key={idx} style={{ padding: '10px', borderRadius: '8px', color: 'white', background: panel.bgGradient === 'purple' ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : (panel.bgGradient === 'emerald' ? 'linear-gradient(135deg, #10b981, #047857)' : (panel.bgGradient === 'orange' ? 'linear-gradient(135deg, #f97316, #c2410c)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)')), border: '1.5px solid #0f172a', boxShadow: '2px 2px 0px #0f172a', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                                <DynamicIcon name={panel.icon || 'MonitorPlay'} size={16} color="#fff" />
                                                                <span style={{ fontSize: '9px', fontWeight: 'bold', marginTop: '4px' }}>{panel.title || 'Başlık'}</span>
                                                                <span style={{ fontSize: '7px', opacity: 0.8 }}>{panel.subtitle || 'Alt Yazı'}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* 4. Modular Sections Mockup */}
                                                <div>
                                                    <span className={styles.previewSectionLabel}>Modüler Sayfa Bölümleri</span>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                        {pageForm.customSections && pageForm.customSections.map((sect, idx) => (
                                                            <div key={idx} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#f8fafc' }}>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', fontWeight: 'bold' }}>
                                                                    <DynamicIcon name={sect.icon || 'Award'} size={12} color={sect.iconColor || '#3b82f6'} />
                                                                    <span>{sect.title || 'Başlıksız Blok'}</span>
                                                                </div>
                                                                <div style={{ fontSize: '7px', color: '#64748b', marginTop: '2px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                                                    Layout: <span style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{sect.layout}</span> | {sect.content || 'İçerik belirtilmemiş.'}
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {(!pageForm.customSections || pageForm.customSections.length === 0) && (
                                                            <div className={styles.previewEmptyState}>Ekstra modüler bölüm bulunmuyor.</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {editingPage.id === 'about' && (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                                {/* 1. About Description Block */}
                                                <div>
                                                    <span className={styles.previewSectionLabel}>Kurumsal Tanıtım</span>
                                                    <div style={{ border: '2px solid #0f172a', padding: '12px', borderRadius: '8px', boxShadow: '3px 3px 0 #0f172a' }}>
                                                        <h4 style={{ fontSize: '11px', fontWeight: 'bold' }}>Hakkımızda</h4>
                                                        <p style={{ fontSize: '8px', color: '#475569', marginTop: '4px', lineHeight: 1.4 }}>
                                                            {pageForm.aboutText || 'Kurumsal tanıtım metni buraya yazılacak...'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* 2. Vision and Mission Split Frame */}
                                                <div>
                                                    <span className={styles.previewSectionLabel}>Vizyonumuz & Misyonumuz</span>
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                                        <div style={{ border: '1.5px solid #0f172a', padding: '8px', borderRadius: '6px', background: '#eff6ff', boxShadow: '2px 2px 0 #0f172a' }}>
                                                            <h5 style={{ fontSize: '9px', fontWeight: 'bold', color: '#1d4ed8' }}>🎯 Vizyonumuz</h5>
                                                            <p style={{ fontSize: '7px', color: '#475569', marginTop: '2px', lineHeight: 1.3 }}>{pageForm.aboutVision}</p>
                                                        </div>
                                                        <div style={{ border: '1.5px solid #0f172a', padding: '8px', borderRadius: '6px', background: '#f0fdf4', boxShadow: '2px 2px 0 #0f172a' }}>
                                                            <h5 style={{ fontSize: '9px', fontWeight: 'bold', color: '#15803d' }}>🚀 Misyonumuz</h5>
                                                            <p style={{ fontSize: '7px', color: '#475569', marginTop: '2px', lineHeight: 1.3 }}>{pageForm.aboutMission}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* 3. Static Stats Indicators */}
                                                <div>
                                                    <span className={styles.previewSectionLabel}>Başarı İstatistikleri</span>
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '4px' }}>
                                                        {[
                                                            { val: '50K+', label: 'Öğrenci' },
                                                            { val: '500+', label: 'Eğitim' },
                                                            { val: '%98', label: 'Başarı' },
                                                            { val: '10+', label: 'Tecrübe' }
                                                        ].map((item, idx) => (
                                                            <div key={idx} style={{ border: '1.5px solid #0f172a', padding: '4px', borderRadius: '4px', textAlign: 'center', background: '#fff', boxShadow: '1.5px 1.5px 0 #0f172a' }}>
                                                                <div style={{ fontSize: '9px', fontWeight: '900' }}>{item.val}</div>
                                                                <div style={{ fontSize: '6px', color: '#64748b' }}>{item.label}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* 4. Modular Alternating Blocks */}
                                                <div>
                                                    <span className={styles.previewSectionLabel}>Dinamik Ekstra Bölümler</span>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                        {pageForm.customSections && pageForm.customSections.map((sect, idx) => (
                                                            <div key={idx} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#f8fafc' }}>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', fontWeight: 'bold' }}>
                                                                    <DynamicIcon name={sect.icon || 'Award'} size={12} color={sect.iconColor || '#3b82f6'} />
                                                                    <span>{sect.title || 'Başlıksız Blok'}</span>
                                                                </div>
                                                                <div style={{ fontSize: '7px', color: '#64748b', marginTop: '2px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                                                    Layout: <span style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{sect.layout}</span> | {sect.content || 'İçerik belirtilmemiş.'}
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {(!pageForm.customSections || pageForm.customSections.length === 0) && (
                                                            <div className={styles.previewEmptyState}>Ekstra modüler bölüm bulunmuyor.</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.modalFooter} style={{ flexShrink: 0 }}>
                        <button type="button" className={styles.btnCancel} onClick={onClose}>
                            İPTAL ET
                        </button>
                        <button type="submit" className={styles.btnSubmit} style={{ marginTop: 0 }}>
                            <Save size={14} />
                            <span>DEĞİŞİKLİKLERİ KAYDET</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
