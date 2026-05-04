/**
 * Utility to generate WhatsApp order links for Tria Lampe Store
 */

export interface OrderDetails {
    items: {
        name: string;
        quantity: number;
        price: number;
    }[];
    totalPrice: number;
    customerInfo?: {
        name?: string;
        phone?: string;
        address?: string;
    };
}

const DEFAULT_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';

/**
 * Sanitizes a phone number for use in a wa.me link.
 */
function sanitizePhoneNumber(phone: string): string {
    if (!phone) return '';
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10 && (cleaned.startsWith('06') || cleaned.startsWith('07'))) {
        cleaned = '212' + cleaned.substring(1);
    }
    if (cleaned.startsWith('00')) {
        cleaned = cleaned.substring(2);
    }
    return cleaned;
}

export function generateWhatsAppLink(order: OrderDetails, customNumber?: string): string {
    const header = "✨ *NOUVELLE RÉSERVATION - TRIA LAMPE*\n_L'Art de la Lumière_\n\n";

    const itemsList = order.items
        .map(item => `💎 *${item.name.toUpperCase()}*\n   Quantité: ${item.quantity}\n   Valeur: ${Number(item.price).toLocaleString()} MAD`)
        .join("\n\n");

    // Luxury Threshold: 2000 MAD for free delivery
    const deliveryFee = Number(order.totalPrice) >= 2000 ? 0 : 250;
    const deliveryText = deliveryFee > 0 ? `\n🚚 *LOGISTIQUE SPÉCIALISÉE: ${deliveryFee.toLocaleString()} MAD*` : `\n🚚 *LOGISTIQUE PRESTIGE: OFFERTE*`;
    const finalTotal = Number(order.totalPrice) + deliveryFee;

    const footer = `${deliveryText}\n💰 *ESTIMATION TOTALE: ${finalTotal.toLocaleString()} MAD*`;

    let customerSection = "";
    if (order.customerInfo && (order.customerInfo.name || order.customerInfo.phone || order.customerInfo.address)) {
        customerSection = "\n\n👤 *INFOS CLIENT*:\n";
        if (order.customerInfo.name) customerSection += `Nom: ${order.customerInfo.name}\n`;
        if (order.customerInfo.phone) customerSection += `Tél: ${order.customerInfo.phone}\n`;
        if (order.customerInfo.address) customerSection += `Adresse: ${order.customerInfo.address}\n`;
    }

    const fullMessage = `${header}${itemsList}${footer}${customerSection}\n\n_Protocole généré via Tria Lampe Conciergerie_`;

    const encodedMessage = encodeURIComponent(fullMessage);
    const finalNumber = sanitizePhoneNumber(customNumber || DEFAULT_WHATSAPP_NUMBER);
    
    return `https://wa.me/${finalNumber}?text=${encodedMessage}`;
}
