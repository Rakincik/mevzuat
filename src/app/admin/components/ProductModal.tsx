'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { X, Plus, Save, Info, Sparkles, HelpCircle, FileText, DollarSign, Image as ImageIcon, Tag, Trash2, ArrowRight, ArrowLeft } from 'lucide-react'
import { useApp, Product } from '@/context/AppContext'
import styles from '../page.module.css'

interface ProductModalProps {
    isOpen: boolean
    onClose: () => void
    editingProduct: Product | null
    triggerToast: (message: string) => void
}

interface ProductCoupon {
    id: string
    code: string
    discountType: 'percentage' | 'fixed'
    discountValue: number
    maxUses?: number
    usedCount: number
    description: string
}

export default function ProductModal({ isOpen, onClose, editingProduct, triggerToast }: ProductModalProps) {
    const { addProduct, updateProduct, addKurum, kurumlar, products, altKategoriler, triggerConfirm } = useApp()
    const [newExclusiveCoupon, setNewExclusiveCoupon] = useState({
        code: '',
        discountType: 'percentage' as 'percentage' | 'fixed',
        discountValue: '',
        maxUses: '',
        description: ''
    })
    const [activeTab, setActiveTab] = useState<'general' | 'media' | 'faq' | 'coupons'>('general')
    const [isSlugPristine, setIsSlugPristine] = useState(true)
    const [selectedAltCategoryOption, setSelectedAltCategoryOption] = useState('new')

    const [isAddingNewKurum, setIsAddingNewKurum] = useState(false)
    const [newKurumForm, setNewKurumForm] = useState({
        name: '',
        color: '#3b82f6',
        description: '',
        slug: ''
    })

    const handleNewKurumNameChange = (val: string) => {
        setNewKurumForm(prev => ({
            ...prev,
            name: val,
            slug: slugify(val)
        }))
    }

    const [productForm, setProductForm] = useState({
        name: '',
        slug: '',
        description: '',
        price: '',
        salePrice: '',
        categoryName: 'Online Eğitim',
        kurumSlug: '',
        kurumSlugs: [] as string[],
        altKategoriName: '',
        altKategoriSlug: '',
        altKategoriSlugs: [] as string[],
        image: '/images/premium-mevzuat-cover.png',
        images: [] as string[],
        faqs: [] as { q: string; a: string }[],
        exclusiveCoupons: '',
        exclusiveCouponsList: [] as ProductCoupon[],
        order: '9999',
        features: [] as string[],
        whyUs: [] as { title: string; description: string }[],
        badges: [] as string[],
        status: 'active' as 'active' | 'passive',
        showOnHomepage: true,
        instructorName: '',
        totalDuration: ''
    })

    // Turkish friendly slugify helper
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
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start
            .replace(/-+$/, '')             // Trim - from end
    }

    // Get unique Level 2 subcategories for the selected institutions (kurumSlugs)
    const existingAltCategories = useMemo(() => {
        const selectedSlugs = productForm.kurumSlugs.length > 0 ? productForm.kurumSlugs : [productForm.kurumSlug].filter(Boolean)
        if (selectedSlugs.length === 0) return []
        return altKategoriler.filter(cat => 
            cat.kurumSlugs.some(slug => selectedSlugs.includes(slug))
        )
    }, [productForm.kurumSlug, productForm.kurumSlugs, altKategoriler])

    // Sync form state when modal opens/changes
    useEffect(() => {
        setIsAddingNewKurum(false)
        setNewKurumForm({
            name: '',
            color: '#3b82f6',
            description: '',
            slug: ''
        })
        if (editingProduct) {
            const loadedKurumSlugs = editingProduct.kurumSlugs || [editingProduct.kurumSlug].filter(Boolean)
            const loadedAltKategoriSlugs = editingProduct.altKategoriSlugs || [editingProduct.altKategoriSlug].filter(Boolean)
            setProductForm({
                name: editingProduct.name,
                slug: editingProduct.slug,
                description: editingProduct.description,
                price: editingProduct.price.toString(),
                salePrice: editingProduct.salePrice ? editingProduct.salePrice.toString() : '',
                categoryName: editingProduct.categoryName,
                kurumSlug: editingProduct.kurumSlug,
                kurumSlugs: loadedKurumSlugs,
                altKategoriName: editingProduct.altKategoriName || '',
                altKategoriSlug: editingProduct.altKategoriSlug || '',
                altKategoriSlugs: loadedAltKategoriSlugs,
                image: editingProduct.image || '/images/premium-mevzuat-cover.png',
                images: editingProduct.images || (editingProduct.image ? [editingProduct.image] : []),
                faqs: (editingProduct as any).faqs || [],
                exclusiveCoupons: (editingProduct as any).exclusiveCoupons || '',
                exclusiveCouponsList: (editingProduct as any).exclusiveCouponsList || [],
                order: editingProduct.order !== undefined ? editingProduct.order.toString() : '9999',
                status: editingProduct.status || 'active',
                showOnHomepage: editingProduct.showOnHomepage !== false,
                instructorName: editingProduct.instructorName || '',
                totalDuration: editingProduct.totalDuration || '',
                features: (editingProduct as any).features || [],
                whyUs: (editingProduct as any).whyUs || [],
                badges: (editingProduct as any).badges || []
            })
            setIsSlugPristine(false)
            setSelectedAltCategoryOption(editingProduct.altKategoriSlug || 'new')
        } else {
            const initialKurumSlug = kurumlar[0]?.slug || 'genel-gys'
            setProductForm({
                name: '',
                slug: '',
                description: '',
                price: '',
                salePrice: '',
                categoryName: 'Online Eğitim',
                kurumSlug: initialKurumSlug,
                kurumSlugs: [initialKurumSlug],
                altKategoriName: '',
                altKategoriSlug: '',
                altKategoriSlugs: [],
                image: '/images/premium-mevzuat-cover.png',
                images: [],
                faqs: [],
                exclusiveCoupons: '',
                exclusiveCouponsList: [] as ProductCoupon[],
                order: '9999',
                status: 'active',
                showOnHomepage: true,
                instructorName: '',
                totalDuration: '',
                features: [
                    "Tamamı Video Çözümlü",
                    "Mobil Uygulama Desteği",
                    "7/24 Eğitmen Desteği",
                    "1 Yıl Sınırsız Erişim"
                ],
                whyUs: [
                    { title: "Güncel Mevzuat", description: "En son değişikliklere göre anında güncellenmiştir." },
                    { title: "Çıkmış Soru Analizi", description: "Geçmiş sınav soruları detaylı çözümleriyle birlikte." },
                    { title: "Uzman Eğitmen", description: "Alanında deneyimli eğitmenler tarafından hazırlanmıştır." }
                ],
                badges: [
                    "Anında Erişim",
                    "Güvenli Ödeme",
                    "14 Gün İade"
                ]
            })
            setIsSlugPristine(true)
            setSelectedAltCategoryOption('new')
        }
        setActiveTab('general')
    }, [editingProduct, isOpen, kurumlar])

    const handleKurumToggle = (slug: string) => {
        setProductForm(prev => {
            const alreadySelected = prev.kurumSlugs.includes(slug)
            const nextSlugs = alreadySelected
                ? prev.kurumSlugs.filter(s => s !== slug)
                : [...prev.kurumSlugs, slug]
            return {
                ...prev,
                kurumSlugs: nextSlugs,
                kurumSlug: nextSlugs[0] || ''
            }
        })
    }

    const handleAltCategoryToggle = (slug: string) => {
        setProductForm(prev => {
            const alreadySelected = prev.altKategoriSlugs.includes(slug)
            const nextSlugs = alreadySelected
                ? prev.altKategoriSlugs.filter(s => s !== slug)
                : [...prev.altKategoriSlugs, slug]
            return {
                ...prev,
                altKategoriSlugs: nextSlugs,
                altKategoriSlug: nextSlugs[0] || ''
            }
        })
    }

    if (!isOpen) return null

    // Real-time Slugify as Name changes
    const handleNameChange = (nameVal: string) => {
        const nextSlug = isSlugPristine ? slugify(nameVal) : productForm.slug
        setProductForm(prev => ({
            ...prev,
            name: nameVal,
            slug: nextSlug
        }))
    }

    const handleAltCategoryOptionChange = (optionVal: string) => {
        setSelectedAltCategoryOption(optionVal)
        if (optionVal === 'new') {
            setProductForm(prev => ({
                ...prev,
                altKategoriName: '',
                altKategoriSlug: ''
            }))
        } else {
            const found = existingAltCategories.find(c => c.slug === optionVal)
            if (found) {
                setProductForm(prev => ({
                    ...prev,
                    altKategoriName: found.name,
                    altKategoriSlug: found.slug
                }))
            }
        }
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        const fileArray = Array.from(files)
        const validFiles = fileArray.filter(file => {
            if (file.size > 10 * 1024 * 1024) {
                triggerConfirm({
                    title: 'Dosya Çok Büyük',
                    message: `"${file.name}" çok büyük! Maksimum 10 MB yükleyebilirsiniz.`,
                    confirmText: 'Tamam',
                    cancelText: 'Kapat',
                    isDangerous: true,
                    onConfirm: () => {}
                })
                return false
            }
            return true
        })

        if (validFiles.length === 0) return

        let loadedCount = 0
        const newImages: string[] = []

        validFiles.forEach(file => {
            const reader = new FileReader()
            reader.onloadend = async () => {
                if (reader.result) {
                    try {
                        const compressed = await compressImage(reader.result as string)
                        newImages.push(compressed)
                    } catch (err) {
                        newImages.push(reader.result as string)
                    }
                }
                loadedCount++
                if (loadedCount === validFiles.length) {
                    setProductForm(prev => ({
                        ...prev,
                        images: [...(prev.images || []), ...newImages]
                    }))
                }
            }
            reader.readAsDataURL(file)
        })
    }

    const removeImage = (indexToRemove: number) => {
        setProductForm(prev => ({
            ...prev,
            images: (prev.images || []).filter((_, idx) => idx !== indexToRemove)
        }))
    }

    const setAsCover = (index: number) => {
        setProductForm(prev => {
            const imgs = [...(prev.images || [])]
            if (index > 0 && index < imgs.length) {
                const [target] = imgs.splice(index, 1)
                imgs.unshift(target)
            }
            return { ...prev, images: imgs }
        })
    }

    // Product-exclusive coupon state helpers
    const addExclusiveCoupon = () => {
        if (!newExclusiveCoupon.code.trim() || !newExclusiveCoupon.discountValue) {
            alert('Lütfen kupon kodu ve indirim miktarı alanlarını doldurun.')
            return
        }

        const value = parseFloat(newExclusiveCoupon.discountValue)
        if (isNaN(value) || value <= 0) {
            alert('Lütfen geçerli bir indirim değeri girin.')
            return
        }

        if (newExclusiveCoupon.discountType === 'percentage' && value > 100) {
            alert('Yüzdesel indirim oranı %100\'den fazla olamaz.')
            return
        }

        const maxUsesVal = newExclusiveCoupon.maxUses.trim() ? parseInt(newExclusiveCoupon.maxUses) : undefined
        if (maxUsesVal !== undefined && (isNaN(maxUsesVal) || maxUsesVal <= 0)) {
            alert('Lütfen geçerli bir kullanım sınırı girin.')
            return
        }

        const defaultDesc = newExclusiveCoupon.discountType === 'percentage'
            ? `Bu eğitime özel %${value} indirim`
            : `Bu eğitime özel ${value} ₺ sabit indirim`

        const newCoupon: ProductCoupon = {
            id: 'coupon_' + Date.now(),
            code: newExclusiveCoupon.code.trim().toUpperCase(),
            discountType: newExclusiveCoupon.discountType,
            discountValue: value,
            maxUses: maxUsesVal,
            usedCount: 0,
            description: newExclusiveCoupon.description.trim() || defaultDesc
        }

        setProductForm(prev => {
            const list = [...(prev.exclusiveCouponsList || []), newCoupon]
            const codes = list.map(c => c.code).join(', ')
            return {
                ...prev,
                exclusiveCouponsList: list,
                exclusiveCoupons: codes
            }
        })

        setNewExclusiveCoupon({ code: '', discountType: 'percentage', discountValue: '', maxUses: '', description: '' })
    }

    const removeExclusiveCoupon = (id: string) => {
        setProductForm(prev => {
            const list = (prev.exclusiveCouponsList || []).filter(c => c.id !== id)
            const codes = list.map(c => c.code).join(', ')
            return {
                ...prev,
                exclusiveCouponsList: list,
                exclusiveCoupons: codes
            }
        })
    }

    // Dynamic FAQ state management helpers
    const addFaqItem = () => {
        setProductForm(prev => ({
            ...prev,
            faqs: [...prev.faqs, { q: '', a: '' }]
        }))
    }

    const updateFaqItem = (index: number, field: 'q' | 'a', value: string) => {
        setProductForm(prev => {
            const updatedFaqs = [...prev.faqs]
            updatedFaqs[index] = { ...updatedFaqs[index], [field]: value }
            return { ...prev, faqs: updatedFaqs }
        })
    }

    const removeFaqItem = (index: number) => {
        setProductForm(prev => ({
            ...prev,
            faqs: prev.faqs.filter((_, idx) => idx !== index)
        }))
    }

    // Dynamic Discount Calculations
    const priceNum = parseFloat(productForm.price) || 0
    const salePriceNum = parseFloat(productForm.salePrice) || 0
    let discountPercent = 0
    let discountSavings = 0
    let isSalePriceInvalid = false

    if (priceNum > 0 && salePriceNum > 0) {
        if (salePriceNum >= priceNum) {
            isSalePriceInvalid = true
        } else {
            discountSavings = priceNum - salePriceNum
            discountPercent = Math.round((discountSavings / priceNum) * 100)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        // Manual validation to prevent silent HTML5 required blocks on hidden tabs
        if (!productForm.name.trim()) {
            setActiveTab('general')
            setTimeout(() => {
                const el = document.getElementById('prod-name')
                el?.focus()
            }, 100)
            alert('Lütfen Eğitim / Ders Adını girin.')
            return
        }

        if (productForm.kurumSlugs.length === 0 && !productForm.kurumSlug && (!isAddingNewKurum || !newKurumForm.name.trim())) {
            setActiveTab('general')
            alert('Lütfen en az bir Bakanlık / Üst Kurum seçin veya yeni bir kurum ekleyin.')
            return
        }

        if (!productForm.order) {
            setActiveTab('general')
            setTimeout(() => {
                const el = document.getElementById('prod-order')
                el?.focus()
            }, 100)
            alert('Lütfen Sıralama Değerini girin.')
            return
        }

        if (!productForm.price || parseFloat(productForm.price) < 0) {
            setActiveTab('media')
            setTimeout(() => {
                const el = document.getElementById('prod-price')
                el?.focus()
            }, 100)
            alert('Lütfen geçerli bir Normal Fiyat girin.')
            return
        }

        if (isSalePriceInvalid) {
            setActiveTab('media')
            setTimeout(() => {
                const el = document.getElementById('prod-saleprice')
                el?.focus()
            }, 100)
            alert('Hata: İndirimli fiyat normal fiyattan düşük olmalıdır.')
            return
        }

        const calculatedSlug = productForm.slug.trim() || slugify(productForm.name)
        const priceVal = parseFloat(productForm.price) || 0
        const salePriceVal = productForm.salePrice ? parseFloat(productForm.salePrice) : null

        const altCatName = productForm.altKategoriName.trim() || 'Mevzuat Konu Anlatımı'
        const altCatSlug = productForm.altKategoriSlug.trim() || slugify(altCatName)

        // Handle Institution Creation if active
        let finalKurumSlugs = [...productForm.kurumSlugs]
        let primaryKurumSlug = productForm.kurumSlug || finalKurumSlugs[0] || 'genel-gys'

        if (isAddingNewKurum && newKurumForm.name.trim()) {
            const addedSlug = newKurumForm.slug.trim() || slugify(newKurumForm.name)
            const alreadyExists = kurumlar.some(k => k.slug === addedSlug)
            if (!alreadyExists) {
                const newKurum = {
                    id: 'kurum_' + Date.now(),
                    name: newKurumForm.name.trim(),
                    slug: addedSlug,
                    description: newKurumForm.description.trim() || `${newKurumForm.name} müfredat dersleri.`,
                    icon: 'Landmark',
                    color: newKurumForm.color,
                    productCount: 0
                }
                addKurum(newKurum)
            }
            if (!finalKurumSlugs.includes(addedSlug)) {
                finalKurumSlugs.push(addedSlug)
            }
            if (!primaryKurumSlug || primaryKurumSlug === 'genel-gys') {
                primaryKurumSlug = addedSlug
            }
        }

        // Gather all alt categories selected
        let finalAltKategoriSlugs = [...productForm.altKategoriSlugs]
        let finalAltKategoriNames: string[] = []

        // Resolve names for existing ones from central altKategoriler
        finalAltKategoriSlugs.forEach(slug => {
            const found = altKategoriler.find(c => c.slug === slug)
            if (found) {
                finalAltKategoriNames.push(found.name)
            }
        })

        const primaryAltKategoriSlug = finalAltKategoriSlugs[0] || 'mevzuat-dersleri'
        const primaryAltKategoriName = finalAltKategoriNames[0] || 'Mevzuat Konu Anlatımı'

        const primaryImage = productForm.images && productForm.images.length > 0 
            ? productForm.images[0] 
            : '/images/premium-mevzuat-cover.png'

        const productData = {
            name: productForm.name.trim(),
            slug: calculatedSlug,
            description: productForm.description.trim(),
            price: priceVal,
            salePrice: salePriceVal,
            categoryName: productForm.categoryName,
            kurumSlug: primaryKurumSlug,
            kurumSlugs: finalKurumSlugs.length > 0 ? finalKurumSlugs : [primaryKurumSlug],
            altKategoriSlug: primaryAltKategoriSlug,
            altKategoriName: primaryAltKategoriName,
            altKategoriSlugs: finalAltKategoriSlugs.length > 0 ? finalAltKategoriSlugs : [primaryAltKategoriSlug],
            altKategoriNames: finalAltKategoriNames.length > 0 ? finalAltKategoriNames : [primaryAltKategoriName],
            image: primaryImage,
            images: productForm.images || [],
            faqs: productForm.faqs || [],
            exclusiveCoupons: productForm.exclusiveCoupons.trim(),
            exclusiveCouponsList: productForm.exclusiveCouponsList || [],
            order: productForm.order ? parseInt(productForm.order) : 9999,
            status: productForm.status,
            showOnHomepage: productForm.showOnHomepage,
            instructorName: productForm.instructorName.trim(),
            totalDuration: productForm.totalDuration.trim(),
            features: productForm.features || [],
            whyUs: productForm.whyUs || [],
            badges: productForm.badges || []
        }

        if (editingProduct) {
            updateProduct(editingProduct.id, productData)
            triggerToast('Eğitim başarıyla güncellendi!')
        } else {
            const newProduct: Product = {
                id: 'prod_' + Date.now(),
                ...productData,
                isFeatured: false
            }
            addProduct(newProduct)
            triggerToast('Yeni eğitim başarıyla eklendi!')
        }

        onClose()
    }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer} style={{ maxWidth: '1100px', width: '90%', maxHeight: '92vh', display: 'flex', flexDirection: 'column', padding: '0', borderRadius: '16px', overflow: 'hidden' }}>
                
                {/* Modal Header */}
                <div className={styles.modalHeader} style={{ padding: '20px 28px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: '0', letterSpacing: '-0.02em' }}>
                            {editingProduct ? 'EĞİTİMİ DÜZENLE' : 'YENİ EĞİTİM EKLE'}
                        </h2>
                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginTop: '2px', display: 'block' }}>
                            {editingProduct ? `Düzenlenen: ${editingProduct.name}` : 'Kataloğunuza yeni bir sınav hazırlık seti veya mevzuat eğitimi ekleyin.'}
                        </span>
                    </div>
                    <button className={styles.modalCloseBtn} onClick={onClose} style={{ padding: '8px', background: '#f1f5f9' }}>
                        <X size={18} />
                    </button>
                </div>

                {/* Apple-Style Navigation Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', padding: '8px 24px', gap: '6px', overflowX: 'auto' }}>
                    <button 
                        type="button"
                        onClick={() => setActiveTab('general')}
                        style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '10px 16px', 
                            borderRadius: '8px', 
                            fontSize: '13px', 
                            fontWeight: '700', 
                            border: 'none', 
                            cursor: 'pointer', 
                            background: activeTab === 'general' ? '#3b82f6' : 'transparent', 
                            color: activeTab === 'general' ? 'white' : '#475569', 
                            transition: 'all 0.2s ease',
                            boxShadow: activeTab === 'general' ? '0 4px 10px rgba(59, 130, 246, 0.25)' : 'none'
                        }}
                    >
                        <FileText size={15} />
                        <span>1. Genel Bilgiler</span>
                    </button>
                    <button 
                        type="button"
                        onClick={() => setActiveTab('media')}
                        style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '10px 16px', 
                            borderRadius: '8px', 
                            fontSize: '13px', 
                            fontWeight: '700', 
                            border: 'none', 
                            cursor: 'pointer', 
                            background: activeTab === 'media' ? '#3b82f6' : 'transparent', 
                            color: activeTab === 'media' ? 'white' : '#475569', 
                            transition: 'all 0.2s ease',
                            boxShadow: activeTab === 'media' ? '0 4px 10px rgba(59, 130, 246, 0.25)' : 'none'
                        }}
                    >
                        <DollarSign size={15} />
                        <span>2. Medya & Fiyat</span>
                    </button>
                    <button 
                        type="button"
                        onClick={() => setActiveTab('faq')}
                        style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '10px 16px', 
                            borderRadius: '8px', 
                            fontSize: '13px', 
                            fontWeight: '700', 
                            border: 'none', 
                            cursor: 'pointer', 
                            background: activeTab === 'faq' ? '#3b82f6' : 'transparent', 
                            color: activeTab === 'faq' ? 'white' : '#475569', 
                            transition: 'all 0.2s ease',
                            boxShadow: activeTab === 'faq' ? '0 4px 10px rgba(59, 130, 246, 0.25)' : 'none'
                        }}
                    >
                        <HelpCircle size={15} />
                        <span>3. Açıklama & SSS</span>
                    </button>
                    <button 
                        type="button"
                        onClick={() => setActiveTab('coupons')}
                        style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '10px 16px', 
                            borderRadius: '8px', 
                            fontSize: '13px', 
                            fontWeight: '700', 
                            border: 'none', 
                            cursor: 'pointer', 
                            background: activeTab === 'coupons' ? '#3b82f6' : 'transparent', 
                            color: activeTab === 'coupons' ? 'white' : '#475569', 
                            transition: 'all 0.2s ease',
                            boxShadow: activeTab === 'coupons' ? '0 4px 10px rgba(59, 130, 246, 0.25)' : 'none'
                        }}
                    >
                        <Tag size={15} />
                        <span>4. Özel Kuponlar</span>
                    </button>
                </div>

                {/* Form Wrapper */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flexGrow: '1', overflow: 'hidden', margin: '0' }}>
                    
                    {/* Spacious Scrollable Body */}
                    <div className={styles.modalBody} style={{ padding: '32px 36px', overflowY: 'auto', flexGrow: '1' }}>
                        
                        {/* TAB 1: GENEL BILGILER */}
                        {activeTab === 'general' && (
                            <div className={styles.adminForm} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="prod-name" style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>Eğitim / Ders Adı *</label>
                                    <input 
                                        id="prod-name"
                                        type="text"
                                        value={productForm.name}
                                        onChange={(e) => handleNameChange(e.target.value)}
                                        className={styles.formInput}
                                        style={{ padding: '12px 16px', fontSize: '14px' }}
                                        placeholder="Örn: 657 Sayılı Devlet Memurları Kanunu Konu Anlatımı"
                                    />
                                </div>

                                <div className={styles.formRow} style={{ gap: '24px', display: 'grid', gridTemplateColumns: '1.2fr 1fr 0.8fr' }}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="prod-slug" style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>Link Slug (URL Adresi)</label>
                                        <input 
                                            id="prod-slug"
                                            type="text"
                                            value={productForm.slug}
                                            onChange={(e) => {
                                                setProductForm({ ...productForm, slug: e.target.value })
                                                setIsSlugPristine(false)
                                            }}
                                            className={styles.formInput}
                                            style={{ padding: '12px 16px', fontSize: '14px' }}
                                            placeholder="Örn: 657-sayili-kanun"
                                        />
                                        {isSlugPristine && productForm.name && (
                                            <div style={{ color: '#6366f1', fontSize: '11px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                                                <Sparkles size={11} />
                                                <span>Başlıktan otomatik üretiliyor...</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="prod-cat" style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>Kategori Türü *</label>
                                        <select
                                            id="prod-cat"
                                            value={productForm.categoryName}
                                            onChange={(e) => setProductForm({ ...productForm, categoryName: e.target.value })}
                                            className={styles.formSelect}
                                            style={{ padding: '12px 16px', fontSize: '14px' }}
                                        >
                                            <option value="Online Eğitim">Online Eğitim</option>
                                            <option value="Kitap Seti">Kitap Seti</option>
                                            <option value="Kurum Sınavı">Kurum Sınavı</option>
                                            <option value="Ortak Mevzuat">Ortak Mevzuat</option>
                                            <option value="Tam Paket">Tam Paket</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="prod-order" style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>Sıralama Değeri *</label>
                                        <input 
                                            id="prod-order"
                                            type="number"
                                            min="1"
                                            value={productForm.order}
                                            onChange={(e) => setProductForm({ ...productForm, order: e.target.value })}
                                            className={styles.formInput}
                                            style={{ padding: '12px 16px', fontSize: '14px' }}
                                            placeholder="Örn: 1"
                                        />
                                        <div style={{ color: '#64748b', fontSize: '11px', marginTop: '4px', fontWeight: '600' }}>
                                            Katalogda bu sırayla listelenir.
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.formRow} style={{ gap: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="prod-instructor" style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>Eğitmen Adı / Profili (Opsiyonel)</label>
                                        <input 
                                            id="prod-instructor"
                                            type="text"
                                            value={productForm.instructorName}
                                            onChange={(e) => setProductForm({ ...productForm, instructorName: e.target.value })}
                                            className={styles.formInput}
                                            style={{ padding: '12px 16px', fontSize: '14px' }}
                                            placeholder="Örn: Dr. Ahmet Yılmaz"
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="prod-duration" style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>Toplam Eğitim Süresi / Hacmi (Opsiyonel)</label>
                                        <input 
                                            id="prod-duration"
                                            type="text"
                                            value={productForm.totalDuration}
                                            onChange={(e) => setProductForm({ ...productForm, totalDuration: e.target.value })}
                                            className={styles.formInput}
                                            style={{ padding: '12px 16px', fontSize: '14px' }}
                                            placeholder="Örn: 45 Saat Video, 120 Sayfa PDF"
                                        />
                                    </div>
                                </div>

                                <div className={styles.formRow} style={{ gap: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                                    <div className={styles.formGroup}>
                                        <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>Durum</label>
                                        <select 
                                            value={productForm.status}
                                            onChange={(e) => setProductForm({ ...productForm, status: e.target.value as 'active' | 'passive' })}
                                            className={styles.formSelect}
                                            style={{ padding: '12px 16px', fontSize: '14px' }}
                                        >
                                            <option value="active">Aktif (Yayında)</option>
                                            <option value="passive">Pasif (Gizli)</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup} style={{ display: 'flex', alignItems: 'center' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#334155', marginTop: '24px' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={productForm.showOnHomepage}
                                                onChange={(e) => setProductForm({ ...productForm, showOnHomepage: e.target.checked })}
                                                style={{ width: '18px', height: '18px' }}
                                            />
                                            Ana Sayfa Vitrininde Göster
                                        </label>
                                    </div>
                                </div>

                                <div className={styles.formRow} style={{ gap: '24px' }}>
                                    <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                                        <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '10px', display: 'block' }}>Bakanlık / Üst Kurum * (Birden fazla seçebilirsiniz)</label>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                            {kurumlar.map(k => {
                                                const isSelected = productForm.kurumSlugs.includes(k.slug)
                                                return (
                                                    <label 
                                                        key={k.slug} 
                                                        style={{ 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            gap: '10px', 
                                                            padding: '12px', 
                                                            background: isSelected ? '#eff6ff' : 'white', 
                                                            borderTop: isSelected ? `2px solid ${k.color || '#3b82f6'}` : '1px solid #cbd5e1', 
                                                            borderRight: isSelected ? `2px solid ${k.color || '#3b82f6'}` : '1px solid #cbd5e1', 
                                                            borderBottom: isSelected ? `2px solid ${k.color || '#3b82f6'}` : '1px solid #cbd5e1', 
                                                            borderLeft: `5px solid ${k.color || '#3b82f6'}`, 
                                                            borderRadius: '8px', 
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                    >
                                                        <input 
                                                            type="checkbox" 
                                                            checked={isSelected}
                                                            onChange={() => handleKurumToggle(k.slug)}
                                                            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                                        />
                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                            <span style={{ fontSize: '12px', fontWeight: '800', color: '#1e293b', lineHeight: '1.2' }}>{k.name}</span>
                                                        </div>
                                                    </label>
                                                )
                                            })}
                                        </div>

                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '12px', background: '#f8fafc', border: '1px dashed #94a3b8', borderRadius: '8px', width: 'fit-content', marginTop: '12px' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={isAddingNewKurum} 
                                                onChange={(e) => setIsAddingNewKurum(e.target.checked)}
                                                style={{ width: '15px', height: '15px', cursor: 'pointer' }}
                                            />
                                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>➕ YENİ BİR ÜST KURUM / BAKANLIK AÇ / EKLE</span>
                                        </label>

                                        {isAddingNewKurum && (
                                            <div className={styles.formRow} style={{ gap: '20px', background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px dashed #cbd5e1', marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="kurum-name" style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Yeni Üst Kurum / Bakanlık Adı *</label>
                                                    <input 
                                                        id="kurum-name"
                                                        type="text"
                                                        value={newKurumForm.name}
                                                        onChange={(e) => handleNewKurumNameChange(e.target.value)}
                                                        className={styles.formInput}
                                                        placeholder="Örn: Gençlik ve Spor Bakanlığı"
                                                    />
                                                </div>
                                                <div className={styles.formGroup}>
                                                    <label htmlFor="kurum-slug" style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Kurum Slug (Otomatik)</label>
                                                    <input 
                                                        id="kurum-slug"
                                                        type="text"
                                                        value={newKurumForm.slug}
                                                        onChange={(e) => setNewKurumForm({ ...newKurumForm, slug: e.target.value })}
                                                        className={styles.formInput}
                                                        placeholder="Örn: genclik-ve-spor-bakanligi"
                                                    />
                                                </div>
                                                <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                                                    <label htmlFor="kurum-desc" style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Kurum Açıklaması</label>
                                                    <input 
                                                        id="kurum-desc"
                                                        type="text"
                                                        value={newKurumForm.description}
                                                        onChange={(e) => setNewKurumForm({ ...newKurumForm, description: e.target.value })}
                                                        className={styles.formInput}
                                                        placeholder="Örn: Gençlik ve Spor Bakanlığı GYS, unvan değişikliği ve şeflik sınavlarına hazırlık dersleri."
                                                    />
                                                </div>
                                                <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                                                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '8px', display: 'block' }}>Kurum Tema Rengi (Sitedeki Vurgu Rengi)</label>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <input 
                                                            type="color" 
                                                            value={newKurumForm.color}
                                                            onChange={(e) => setNewKurumForm({ ...newKurumForm, color: e.target.value })}
                                                            style={{ width: '40px', height: '40px', border: 'none', borderRadius: '50%', cursor: 'pointer', padding: '0', background: 'none' }}
                                                        />
                                                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#334155', fontFamily: 'monospace' }}>{newKurumForm.color}</span>
                                                        
                                                        <div style={{ display: 'flex', gap: '8px', marginLeft: '12px' }}>
                                                            {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'].map(color => (
                                                                <button
                                                                    key={color}
                                                                    type="button"
                                                                    onClick={() => setNewKurumForm({ ...newKurumForm, color })}
                                                                    style={{ 
                                                                        width: '24px', 
                                                                        height: '24px', 
                                                                        borderRadius: '50%', 
                                                                        background: color, 
                                                                        border: newKurumForm.color === color ? '2px solid #0f172a' : '1px solid #e2e8f0', 
                                                                        cursor: 'pointer',
                                                                        transition: 'all 0.15s ease',
                                                                        transform: newKurumForm.color === color ? 'scale(1.15)' : 'none'
                                                                    }}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.formRow} style={{ gap: '24px' }}>
                                    <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                                        <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '10px', display: 'block' }}>Alt Kategori (Grup Sınıflandırması) * (Birden fazla seçebilirsiniz)</label>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {existingAltCategories.length === 0 ? (
                                                <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '14px 18px', borderRadius: '8px', fontSize: '13px', color: '#b45309', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                                                    <Info size={16} style={{ color: '#d97706' }} />
                                                    <span>Seçilen üst kurum(lar) için henüz tanımlı bir alt kategori bulunmuyor. Lütfen <strong>Kategori Yönetimi</strong> panelinden ekleyin.</span>
                                                </div>
                                            ) : (
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px', background: '#f5f3ff', padding: '16px', borderRadius: '12px', border: '1px solid #dcd7ff' }}>
                                                    {existingAltCategories.map(c => {
                                                        const isSelected = productForm.altKategoriSlugs.includes(c.slug)
                                                        return (
                                                            <label 
                                                                key={c.slug} 
                                                                style={{ 
                                                                    display: 'flex', 
                                                                    alignItems: 'center', 
                                                                    gap: '8px', 
                                                                    padding: '10px 12px', 
                                                                    background: isSelected ? '#e0e7ff' : 'white', 
                                                                    border: isSelected ? '2px solid #6366f1' : '1px solid #cbd5e1', 
                                                                    borderRadius: '8px', 
                                                                    cursor: 'pointer',
                                                                    transition: 'all 0.2s ease'
                                                                }}
                                                            >
                                                                <input 
                                                                    type="checkbox" 
                                                                    checked={isSelected}
                                                                    onChange={() => handleAltCategoryToggle(c.slug)}
                                                                    style={{ width: '15px', height: '15px', cursor: 'pointer' }}
                                                                />
                                                                <span style={{ fontSize: '12px', fontWeight: '700', color: '#312e81' }}>📂 {c.name}</span>
                                                            </label>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: MEDYA & FIYAT */}
                        {activeTab === 'media' && (
                            <div className={styles.adminForm} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                                <div className={styles.formRow} style={{ gap: '24px' }}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="prod-price" style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>Normal Fiyat (₺) *</label>
                                        <input 
                                            id="prod-price"
                                            type="number"
                                            min="0"
                                            value={productForm.price}
                                            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                            className={styles.formInput}
                                            style={{ padding: '12px 16px', fontSize: '14px' }}
                                            placeholder="Örn: 1200"
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="prod-saleprice" style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>İndirimli Satış Fiyatı (₺ - İsteğe Bağlı)</label>
                                        <input 
                                            id="prod-saleprice"
                                            type="number"
                                            min="0"
                                            value={productForm.salePrice}
                                            onChange={(e) => setProductForm({ ...productForm, salePrice: e.target.value })}
                                            className={styles.formInput}
                                            style={{ padding: '12px 16px', fontSize: '14px' }}
                                            placeholder="Örn: 850"
                                        />
                                        {isSalePriceInvalid && (
                                            <div style={{ color: '#ef4444', fontSize: '12px', fontWeight: 'bold', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <span>⚠️ Hata: İndirimli fiyat normal fiyattan düşük olmalıdır!</span>
                                            </div>
                                        )}
                                        {discountPercent > 0 && !isSalePriceInvalid && (
                                            <div style={{ 
                                                color: '#16a34a', 
                                                fontSize: '12px', 
                                                fontWeight: 'bold', 
                                                marginTop: '6px'
                                            }}>
                                                <span>%{discountPercent} İndirim</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '8px', display: 'block' }}>Eğitim Görselleri * (Öğrencilerin göreceği kapak ve detay resimleri)</label>
                                    <div className={styles.galleryUploadWrapper} style={{ padding: '24px', borderRadius: '12px' }}>
                                        <div className={styles.imageGrid} style={{ gap: '16px' }}>
                                            {(productForm.images || []).map((imgUrl, index) => (
                                                <div key={index} className={styles.imageSlot} style={{ width: '110px', height: '140px', borderRadius: '8px' }}>
                                                    <img src={imgUrl} alt={`Önizleme ${index + 1}`} style={{ objectFit: 'contain' }} />
                                                    
                                                    {index === 0 ? (
                                                        <span className={styles.coverBadge} style={{ background: '#3b82f6', borderRadius: '4px', fontSize: '10px', padding: '2px 6px' }}>Kapak</span>
                                                    ) : (
                                                        <button 
                                                            type="button" 
                                                            className={styles.setCoverBtn}
                                                            onClick={() => setAsCover(index)}
                                                            title="Kapak Görseli Yap"
                                                            style={{ fontSize: '9px', padding: '2px 4px' }}
                                                        >
                                                            Kapak Yap
                                                        </button>
                                                    )}
                                                    
                                                    <button 
                                                        type="button" 
                                                        className={styles.imageDeleteBadge}
                                                        onClick={() => removeImage(index)}
                                                        title="Görseli Kaldır"
                                                        style={{ background: '#ef4444' }}
                                                    >
                                                        <X size={10} />
                                                    </button>
                                                </div>
                                            ))}
                                            
                                            <label htmlFor="file-upload-multi" className={styles.addSlot} style={{ width: '110px', height: '140px', borderRadius: '8px', border: '2px dashed #cbd5e1' }}>
                                                <Plus size={24} />
                                                <span style={{ fontSize: '10px', marginTop: '4px' }}>Görsel Ekle</span>
                                            </label>
                                            <input 
                                                id="file-upload-multi"
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleFileChange}
                                                style={{ display: 'none' }}
                                            />
                                        </div>
                                        
                                        <div className={styles.uploadSpecsInline} style={{ marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '12px', gap: '16px' }}>
                                            <span className={styles.specInlineItem}><strong>Kapak Ölçüsü:</strong> 800×1000px (Dikey 4:5 oranı önerilir)</span>
                                            <span className={styles.specInlineItem}><strong>Format:</strong> WEBP, PNG, JPG</span>
                                            <span className={styles.specInlineItem}><strong>Limit:</strong> Dosya başı maks 10MB</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 3: ACIKLAMA & SSS */}
                        {activeTab === 'faq' && (
                            <div className={styles.adminForm} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                                {/* Description */}
                                <div className={styles.formGroup}>
                                    <label htmlFor="prod-desc" style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>Ders Tanıtım & Detay Açıklaması</label>
                                    <textarea 
                                        id="prod-desc"
                                        value={productForm.description}
                                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                        className={styles.formTextarea}
                                        style={{ minHeight: '130px', padding: '14px', fontSize: '14px' }}
                                        placeholder="Bu eğitim setinin ders saatleri, müfredat kapsamı, hangi sınavlara uygun olduğu, eğitmen kadrosu vb. detayları öğrencinin karar vermesini kolaylaştıracak şekilde açıklayın..."
                                    />
                                </div>

                                {/* Trust Badges Editor */}
                                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0' }}>🛡️ GÜVEN ROZETLERİ (DETAY SAYFASI ÜST ALAN)</h3>
                                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '500', display: 'block', marginBottom: '14px' }}>
                                        Ders fiyatının hemen altında gösterilen 3 adet güven rozeti yazısını özelleştirin.
                                    </span>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                                        <div className={styles.formGroup}>
                                            <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>🚚 Rozet 1 (Kargo/Erişim)</label>
                                            <input 
                                                type="text"
                                                value={productForm.badges[0] || ''}
                                                onChange={(e) => {
                                                    const nextBadges = [...productForm.badges]
                                                    nextBadges[0] = e.target.value
                                                    setProductForm(prev => ({ ...prev, badges: nextBadges }))
                                                }}
                                                className={styles.formInput}
                                                style={{ padding: '8px 12px', fontSize: '13px' }}
                                                placeholder="Örn: Anında Erişim"
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>🛡️ Rozet 2 (Ödeme Güvenliği)</label>
                                            <input 
                                                type="text"
                                                value={productForm.badges[1] || ''}
                                                onChange={(e) => {
                                                    const nextBadges = [...productForm.badges]
                                                    nextBadges[1] = e.target.value
                                                    setProductForm(prev => ({ ...prev, badges: nextBadges }))
                                                }}
                                                className={styles.formInput}
                                                style={{ padding: '8px 12px', fontSize: '13px' }}
                                                placeholder="Örn: Güvenli Ödeme"
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>⏱️ Rozet 3 (İade / Destek)</label>
                                            <input 
                                                type="text"
                                                value={productForm.badges[2] || ''}
                                                onChange={(e) => {
                                                    const nextBadges = [...productForm.badges]
                                                    nextBadges[2] = e.target.value
                                                    setProductForm(prev => ({ ...prev, badges: nextBadges }))
                                                }}
                                                className={styles.formInput}
                                                style={{ padding: '8px 12px', fontSize: '13px' }}
                                                placeholder="Örn: 14 Gün İade"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                        <div>
                                            <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#1e293b', margin: '0' }}>✅ DERS TANITIM ÖZELLİKLERİ (YEŞİL ONAYLI LİSTE)</h3>
                                            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Sitede yeşil tik işaretiyle listelenecek ders özelliklerini düzenleyin.</span>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={() => setProductForm(prev => ({ ...prev, features: [...prev.features, ''] }))}
                                            className="btn btn-outline btn-sm"
                                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', borderColor: '#10b981', color: '#10b981', fontWeight: 'bold' }}
                                        >
                                            <Plus size={14} />
                                            <span>Özellik Ekle</span>
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {productForm.features.map((feature, idx) => (
                                            <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                <span style={{ color: '#10b981', fontSize: '14px', fontWeight: 'bold' }}>✓</span>
                                                <input 
                                                    type="text"
                                                    value={feature}
                                                    onChange={(e) => {
                                                        const nextFeatures = [...productForm.features]
                                                        nextFeatures[idx] = e.target.value
                                                        setProductForm(prev => ({ ...prev, features: nextFeatures }))
                                                    }}
                                                    className={styles.formInput}
                                                    style={{ padding: '8px 12px', fontSize: '13px', flexGrow: 1 }}
                                                    placeholder="Örn: Tamamı Video Çözümlü"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setProductForm(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }))
                                                    }}
                                                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        {productForm.features.length === 0 && (
                                            <div style={{ border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
                                                Özellik tanımlanmamış. Boş bırakırsanız varsayılan liste gösterilecektir.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Why Us Reasons */}
                                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                        <div>
                                            <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#1e293b', margin: '0' }}>🌟 NEDEN BU DERSİ TERCİH ETMELİSİNİZ?</h3>
                                            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Öğrenciye fayda sağlayacak detaylı neden-açıklama kartlarını düzenleyin.</span>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={() => setProductForm(prev => ({ ...prev, whyUs: [...prev.whyUs, { title: '', description: '' }] }))}
                                            className="btn btn-outline btn-sm"
                                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', borderColor: '#8b5cf6', color: '#8b5cf6', fontWeight: 'bold' }}
                                        >
                                            <Plus size={14} />
                                            <span>Neden Ekle</span>
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {productForm.whyUs.map((item, idx) => (
                                            <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#8b5cf6' }}>NEDEN BLOKU #{idx + 1}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setProductForm(prev => ({ ...prev, whyUs: prev.whyUs.filter((_, i) => i !== idx) }))
                                                        }}
                                                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '700' }}
                                                    >
                                                        <Trash2 size={12} />
                                                        <span>Kaldır</span>
                                                    </button>
                                                </div>
                                                <input 
                                                    type="text"
                                                    value={item.title}
                                                    onChange={(e) => {
                                                        const nextWhyUs = [...productForm.whyUs]
                                                        nextWhyUs[idx] = { ...nextWhyUs[idx], title: e.target.value }
                                                        setProductForm(prev => ({ ...prev, whyUs: nextWhyUs }))
                                                    }}
                                                    className={styles.formInput}
                                                    style={{ padding: '8px 12px', fontSize: '13px', fontWeight: '600' }}
                                                    placeholder="Neden Başlığı (Örn: Güncel Mevzuat)"
                                                />
                                                <textarea 
                                                    value={item.description}
                                                    onChange={(e) => {
                                                        const nextWhyUs = [...productForm.whyUs]
                                                        nextWhyUs[idx] = { ...nextWhyUs[idx], description: e.target.value }
                                                        setProductForm(prev => ({ ...prev, whyUs: nextWhyUs }))
                                                    }}
                                                    className={styles.formTextarea}
                                                    style={{ minHeight: '50px', padding: '8px 12px', fontSize: '12px' }}
                                                    placeholder="Açıklama (Örn: En son değişikliklere göre anında güncellenmiştir.)"
                                                />
                                            </div>
                                        ))}
                                        {productForm.whyUs.length === 0 && (
                                            <div style={{ border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
                                                Neden tanımlanmamış. Boş bırakırsanız varsayılan liste gösterilecektir.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Dynamic Product Specific FAQ Section */}
                                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                        <div>
                                            <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#1e293b', margin: '0' }}>❔ EĞİTİME ÖZEL SIKÇA SORULAN SORULAR (SSS)</h3>
                                            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Öğrencilerin bu derse özel sorabileceği spesifik konuları ve cevaplarını tanımlayın.</span>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={addFaqItem}
                                            className="btn btn-outline btn-sm"
                                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', borderColor: '#3b82f6', color: '#3b82f6', fontWeight: 'bold' }}
                                        >
                                            <Plus size={14} />
                                            <span>Soru Ekle</span>
                                        </button>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {productForm.faqs.map((faq, index) => (
                                            <div key={index} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                                                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#3b82f6' }}>SORU - CEVAP BLOKU #{index + 1}</span>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => removeFaqItem(index)}
                                                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '700' }}
                                                        title="Bu Soru Bloğunu Kaldır"
                                                    >
                                                        <Trash2 size={12} />
                                                        <span>Kaldır</span>
                                                    </button>
                                                </div>

                                                <div className={styles.formGroup} style={{ gap: '4px' }}>
                                                    <input 
                                                        type="text"
                                                        value={faq.q}
                                                        onChange={(e) => updateFaqItem(index, 'q', e.target.value)}
                                                        className={styles.formInput}
                                                        style={{ padding: '8px 12px', fontSize: '13px', fontWeight: '600' }}
                                                        placeholder="Soru (Örn: Bu ders Adalet Bakanlığı Şeflik sınavı ile tam uyumlu mu?)"
                                                    />
                                                </div>
                                                <div className={styles.formGroup} style={{ gap: '4px' }}>
                                                    <textarea 
                                                        value={faq.a}
                                                        onChange={(e) => updateFaqItem(index, 'a', e.target.value)}
                                                        className={styles.formTextarea}
                                                        style={{ minHeight: '60px', padding: '8px 12px', fontSize: '13px' }}
                                                        placeholder="Cevap (Örn: Evet, 2026 yılı güncel müfredatındaki tüm konu başlıkları sırasıyla anlatılmaktadır.)"
                                                    />
                                                </div>
                                            </div>
                                        ))}

                                        {productForm.faqs.length === 0 && (
                                            <div style={{ border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
                                                <HelpCircle size={28} style={{ margin: '0 auto 8px', opacity: '0.6' }} />
                                                <span style={{ fontSize: '12px', display: 'block', fontWeight: '500' }}>Bu eğitime özel soru eklenmemiş. Boş bırakırsanız sitedeki genel SSS'ler gösterilecektir.</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 4: OZEL KUPONLAR */}
                        {activeTab === 'coupons' && (
                            <div className={styles.adminForm} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                    <div style={{ background: '#3b82f6', color: 'white', padding: '10px', borderRadius: '50%', flexShrink: 0 }}>
                                        <Tag size={20} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#1e3a8a', margin: '0 0 4px 0' }}>Ürüne Özel Kupon Kodları Sistemi</h3>
                                        <p style={{ fontSize: '12px', color: '#1e40af', lineHeight: '1.5', margin: '0' }}>
                                            Buraya ekleyeceğiniz kupon kodları <strong>sadece ve sadece bu eğitim seti için</strong> geçerli olacaktır. 
                                            Böylece genel sepete uygulanan kuponlar haricinde, bu eğitime özel indirim miktarı, indirim türü ve kullanım limitleri belirleyebilirsiniz.
                                        </p>
                                    </div>
                                </div>

                                {/* ADD NEW PRODUCT COUPON SUB-FORM */}
                                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#334155', margin: '0' }}>➕ YENİ ÜRÜNE ÖZEL KUPON EKLE</h4>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div className={styles.formGroup}>
                                            <label htmlFor="prod-coup-code" style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Kupon Kodu *</label>
                                            <input 
                                                id="prod-coup-code"
                                                type="text"
                                                value={newExclusiveCoupon.code}
                                                onChange={(e) => setNewExclusiveCoupon({ ...newExclusiveCoupon, code: e.target.value })}
                                                className={styles.formInput}
                                                style={{ padding: '8px 12px', fontSize: '13px', textTransform: 'uppercase' }}
                                                placeholder="Örn: 657OZEL"
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label htmlFor="prod-coup-type" style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>İndirim Türü *</label>
                                            <select
                                                id="prod-coup-type"
                                                value={newExclusiveCoupon.discountType}
                                                onChange={(e) => setNewExclusiveCoupon({ ...newExclusiveCoupon, discountType: e.target.value as 'percentage' | 'fixed' })}
                                                className={styles.formSelect}
                                                style={{ padding: '8px 12px', fontSize: '13px' }}
                                            >
                                                <option value="percentage">% Yüzdesel İndirim</option>
                                                <option value="fixed">₺ Sabit Tutar İndirimi</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div className={styles.formGroup}>
                                            <label htmlFor="prod-coup-val" style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>İndirim Miktarı *</label>
                                            <input 
                                                id="prod-coup-val"
                                                type="number"
                                                value={newExclusiveCoupon.discountValue}
                                                onChange={(e) => setNewExclusiveCoupon({ ...newExclusiveCoupon, discountValue: e.target.value })}
                                                className={styles.formInput}
                                                style={{ padding: '8px 12px', fontSize: '13px' }}
                                                placeholder={newExclusiveCoupon.discountType === 'percentage' ? 'Örn: 20 (%20)' : 'Örn: 100 (100 ₺)'}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label htmlFor="prod-coup-max" style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Kullanım Limiti (Boşsa Sınırsız)</label>
                                            <input 
                                                id="prod-coup-max"
                                                type="number"
                                                value={newExclusiveCoupon.maxUses}
                                                onChange={(e) => setNewExclusiveCoupon({ ...newExclusiveCoupon, maxUses: e.target.value })}
                                                className={styles.formInput}
                                                style={{ padding: '8px 12px', fontSize: '13px' }}
                                                placeholder="Örn: 50"
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="prod-coup-desc" style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Açıklama (İsteğe Bağlı)</label>
                                        <input 
                                            id="prod-coup-desc"
                                            type="text"
                                            value={newExclusiveCoupon.description}
                                            onChange={(e) => setNewExclusiveCoupon({ ...newExclusiveCoupon, description: e.target.value })}
                                            className={styles.formInput}
                                            style={{ padding: '8px 12px', fontSize: '13px' }}
                                            placeholder="Örn: Sadece bu eğitime özel %20 lansman indirimi!"
                                        />
                                    </div>

                                    <button 
                                        type="button"
                                        onClick={addExclusiveCoupon}
                                        className="btn btn-secondary btn-sm"
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', alignSelf: 'flex-start', fontWeight: 'bold' }}
                                    >
                                        <Plus size={14} />
                                        <span>Ürüne Özel Kupon Ekle</span>
                                    </button>
                                </div>

                                {/* ACTIVE PRODUCT COUPONS LIST */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#334155', margin: '0' }}>🎟️ TANIMLANMIŞ KUPONLAR</h4>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {productForm.exclusiveCouponsList && productForm.exclusiveCouponsList.map((coupon, cIdx) => {
                                            const displayRate = coupon.discountType === 'percentage' ? `%${coupon.discountValue} İndirim` : `${coupon.discountValue} ₺ İndirim`
                                            const usesLimitText = coupon.maxUses ? `${coupon.usedCount} / ${coupon.maxUses} Kullanım` : `${coupon.usedCount} Kullanım (Sınırsız)`
                                            
                                            return (
                                                <div key={coupon.id || cIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 18px' }}>
                                                    <div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <span style={{ fontSize: '12px', fontWeight: '800', color: '#1e3a8a', padding: '2px 8px', background: '#dbeafe', borderRadius: '4px', fontFamily: 'monospace' }}>{coupon.code}</span>
                                                            <span style={{ fontSize: '10px', fontWeight: '800', padding: '1px 5px', background: coupon.discountType === 'percentage' ? '#e0f2fe' : '#d1fae5', color: coupon.discountType === 'percentage' ? '#0369a1' : '#047857', borderRadius: '3px' }}>
                                                                {coupon.discountType === 'percentage' ? 'Yüzdesel' : 'Sabit'}
                                                            </span>
                                                        </div>
                                                        <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>{displayRate}</div>
                                                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{coupon.description}</div>
                                                        <div style={{ fontSize: '10px', color: '#475569', fontWeight: 'bold', marginTop: '4px' }}>📊 {usesLimitText}</div>
                                                    </div>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => removeExclusiveCoupon(coupon.id)}
                                                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px' }}
                                                        title="Kuponu Kaldır"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            )
                                        })}

                                        {(!productForm.exclusiveCouponsList || productForm.exclusiveCouponsList.length === 0) && (
                                            <div style={{ border: '2px dashed #cbd5e1', borderRadius: '10px', padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '12px', fontWeight: '500' }}>
                                                Bu eğitime özel kupon tanımlanmamış. Yukarıdan ekleyebilirsiniz.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Modal Footer with Stepper Control */}
                    <div className={styles.modalFooter} style={{ padding: '20px 36px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                        <div>
                            {activeTab !== 'general' && (
                                <button 
                                    type="button" 
                                    className={styles.btnCancel}
                                    onClick={() => {
                                        if (activeTab === 'media') setActiveTab('general')
                                        else if (activeTab === 'faq') setActiveTab('media')
                                        else if (activeTab === 'coupons') setActiveTab('faq')
                                    }}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '700', padding: '10px 18px' }}
                                >
                                    <ArrowLeft size={14} />
                                    <span>Geri</span>
                                </button>
                            )}
                        </div>
                        
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button type="button" className={styles.btnCancel} onClick={onClose} style={{ padding: '10px 18px', fontSize: '13px', fontWeight: '700' }}>
                                VAZGEÇ
                            </button>
                            
                            {activeTab !== 'coupons' ? (
                                <button 
                                    type="button" 
                                    className="btn btn-primary"
                                    onClick={() => {
                                        if (activeTab === 'general') setActiveTab('media')
                                        else if (activeTab === 'media') setActiveTab('faq')
                                        else if (activeTab === 'faq') setActiveTab('coupons')
                                    }}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', fontSize: '13px', fontWeight: '700', marginTop: 0 }}
                                >
                                    <span>İleri</span>
                                    <ArrowRight size={14} />
                                </button>
                            ) : (
                                <button type="submit" className={styles.btnSubmit} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 22px', fontSize: '13px', fontWeight: '800', marginTop: 0, background: '#10b981', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)' }}>
                                    <Save size={15} />
                                    <span>{editingProduct ? 'DEĞİŞİKLİKLERİ KAYDET' : 'EĞİTİMİ EKLE'}</span>
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
