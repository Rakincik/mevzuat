'use client'

import React from 'react'
import { 
    ChevronLeft, ChevronRight, ArrowRight, HelpCircle,
    MonitorPlay, ClipboardList, BookOpen, Target, 
    GraduationCap, Award, Trophy, Users, 
    RefreshCw, Sparkles, Rocket, Landmark, Info, 
    Trash2, Play, CheckCircle, ShieldCheck, Mail, Phone, MapPin,
    ShoppingCart, Menu, X, Zap, LogIn, UserPlus, Search, Scale,
    Twitter, Instagram, Youtube, Linkedin, Facebook, TrendingUp,
    User, FileText, ArrowLeft, Send, MessageSquare
} from 'lucide-react'

// Map of curated icons for premium corporate pages, banners, grids, and buttons
const iconMap: { [key: string]: React.ComponentType<any> } = {
    ChevronLeft, ChevronRight, ArrowRight, HelpCircle,
    MonitorPlay, ClipboardList, BookOpen, Target, 
    GraduationCap, Award, Trophy, Users, 
    RefreshCw, Sparkles, Rocket, Landmark, Info, 
    Trash2, Play, CheckCircle, ShieldCheck, Mail, Phone, MapPin,
    ShoppingCart, Menu, X, Zap, LogIn, UserPlus, Search, Scale,
    Twitter, Instagram, Youtube, Linkedin, Facebook, TrendingUp,
    User, FileText, ArrowLeft, Send, MessageSquare
}

interface DynamicIconProps {
    name: string
    size?: number
    className?: string
    color?: string
    style?: React.CSSProperties
}

export function DynamicIcon({ name, size = 24, className = '', color, style }: DynamicIconProps) {
    // Lookup by PascalCase string name (e.g. 'BookOpen', 'Award')
    const IconComponent = iconMap[name] || HelpCircle
    return <IconComponent size={size} className={className} style={{ color, ...style }} />
}
