const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 
async function main() { 
    const record = await prisma.keyValueStore.findUnique({where: {key: 'app_products'}}); 
    const products = JSON.parse(record.value); 
    console.log('Total Products:', products.length);
    const kurumSlugs = new Set();
    products.forEach(p => {
        if (p.kurumSlug) kurumSlugs.add(p.kurumSlug);
        if (p.kurumSlugs) p.kurumSlugs.forEach(ks => kurumSlugs.add(ks));
    });
    console.log('Kurum Slugs in Products:', Array.from(kurumSlugs));
    
    // Check if we have altKategoriler saved in DB separately
    const altCatRecord = await prisma.keyValueStore.findUnique({where: {key: 'app_alt_kategoriler'}});
    if (altCatRecord) {
        const altCats = JSON.parse(altCatRecord.value);
        console.log('Total AltKategoriler in DB:', altCats.length);
        const kamuAlt = altCats.filter(c => c.kurumSlugs && c.kurumSlugs.includes('kamu-ihale-kurumu'));
        console.log('AltKategoriler for kamu-ihale-kurumu:', kamuAlt.map(c => c.name));
    }
} 
main().catch(console.error).finally(() => prisma.$disconnect());
