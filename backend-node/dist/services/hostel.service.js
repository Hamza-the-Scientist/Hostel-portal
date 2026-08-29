"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostelService = void 0;
const database_1 = require("../config/database");
const Hostel_1 = require("../entities/Hostel");
class HostelService {
    constructor() {
        this.hostelRepo = database_1.AppDataSource.getRepository(Hostel_1.Hostel);
    }
    async getPublicHostels() {
        const hostels = await this.hostelRepo.find({
            where: { isActive: true, isDeleted: false },
            relations: ['images', 'amenities', 'reviews'],
        });
        return hostels.map((h) => {
            let rating = 4.3;
            if (h.reviews && h.reviews.length > 0) {
                const sum = h.reviews.reduce((acc, r) => acc + r.overallRating, 0);
                rating = Math.round((sum / h.reviews.length) * 10) / 10;
            }
            let mainImg = h.images && h.images.find((i) => i.isPrimary)?.imageUrl;
            if (!mainImg && h.images && h.images.length > 0) {
                mainImg = h.images[0].imageUrl;
            }
            if (!mainImg) {
                mainImg =
                    h.gender === 'Female'
                        ? 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80'
                        : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80';
            }
            return {
                hostelId: h.hostelId,
                name: h.name,
                gender: h.gender,
                location: h.address || 'Main Campus, Jamshoro',
                mainImageUrl: mainImg,
                totalCapacity: h.totalCapacity,
                availableBeds: h.totalCapacity,
                rating,
                keyAmenities: h.amenities ? h.amenities.map((a) => a.amenityName).slice(0, 5) : [],
            };
        });
    }
    async getPublicHostelById(id) {
        const hostel = await this.hostelRepo.findOne({
            where: { hostelId: id, isActive: true, isDeleted: false },
            relations: ['images', 'amenities', 'reviews', 'eligibilityRules'],
        });
        if (!hostel) {
            throw { status: 404, message: 'Hostel not found.' };
        }
        let rating = 4.3;
        if (hostel.reviews && hostel.reviews.length > 0) {
            const sum = hostel.reviews.reduce((acc, r) => acc + r.overallRating, 0);
            rating = Math.round((sum / hostel.reviews.length) * 10) / 10;
        }
        const images = hostel.images ? hostel.images.map((i) => i.imageUrl) : [];
        if (images.length === 0) {
            images.push(hostel.gender === 'Female'
                ? 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80'
                : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80');
        }
        const eligibilityList = hostel.eligibilityRules ? hostel.eligibilityRules.map((e) => `${e.mode} ${e.ruleType}: ${e.values ? e.values.join(', ') : ''}`) : [];
        if (eligibilityList.length === 0 && hostel.eligibilityRequirement) {
            eligibilityList.push(hostel.eligibilityRequirement);
        }
        return {
            hostelId: hostel.hostelId,
            name: hostel.name,
            gender: hostel.gender,
            location: hostel.address || 'Main Campus, Jamshoro',
            provost: hostel.provost || hostel.warden || 'Prof. Dr. Provost Office',
            provostPhone: hostel.provostPhone || hostel.wardenPhone || '+92 300 0000000',
            warden: hostel.provost || hostel.warden || 'Prof. Dr. Provost Office',
            wardenPhone: hostel.provostPhone || hostel.wardenPhone || '+92 300 0000000',
            totalCapacity: hostel.totalCapacity,
            occupiedBeds: 0,
            availableBeds: hostel.totalCapacity,
            rating,
            reviewCount: hostel.reviews ? hostel.reviews.length : 12,
            isAllocationOpen: true,
            images,
            amenities: hostel.amenities ? hostel.amenities.map((a) => a.amenityName) : [],
            eligibilitySummary: eligibilityList,
        };
    }
}
exports.HostelService = HostelService;
//# sourceMappingURL=hostel.service.js.map