const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 
async function main() { 
    const record = await prisma.keyValueStore.findUnique({where: {key: 'app_products'}}); 
    const products = JSON.parse(record.value); 
    const kamu = products.filter(p => p.kurumSlug === 'kamu-ihale-kurumu' || (p.kurumSlugs && p.kurumSlugs.includes('kamu-ihale-kurumu'))); 
    console.log('Products:', kamu.length); 
    kamu.forEach(p => console.log(p.name, p.kurumSlug, p.altKategoriSlug, p.altKategoriSlugs)); 
} 
main().catch(console.error).finally(() => prisma.$disconnect());
