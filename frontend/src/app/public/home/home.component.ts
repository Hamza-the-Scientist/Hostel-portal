import { Component, inject, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PublicService } from '../public.service';
import { HostelSummary, Announcement, HostelReview } from '../public.model';

export interface HeroSlide {
  id: number;
  theme: string;
  header: string;
  subheader: string;
}

export interface InfoSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  bullets: { label: string; desc: string }[];
}

@Component({
  selector: 'app-public-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styles: [`
    /* Hero Section */
    .hero {
      background: #031B33;
      color: white;
      padding: 5.5rem 1.5rem 4.5rem 1.5rem;
      text-align: center;
      border-bottom: 1px solid #003366;
      position: relative;
      overflow: hidden;
    }

    /* Side Navigation Arrows matching the Deep Navy / Teal Theme */
    .hero-nav-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: rgba(3, 27, 51, 0.85);
      border: 1.5px solid #00D4B2;
      color: #00D4B2;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 30;
      transition: all 250ms ease;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.35);
      outline: none;
      padding: 0;
    }

    .hero-nav-arrow:hover {
      background: #00D4B2;
      color: #031B33;
      transform: translateY(-50%) scale(1.08);
      box-shadow: 0 0 15px rgba(0, 212, 178, 0.5);
    }

    .hero-nav-arrow.left { left: 1.5rem; }
    .hero-nav-arrow.right { right: 1.5rem; }

    @media (max-width: 1024px) {
      .hero-nav-arrow.left { left: 1rem; }
      .hero-nav-arrow.right { right: 1rem; }
    }

    @media (max-width: 640px) {
      .hero-nav-arrow { width: 32px; height: 32px; }
      .hero-nav-arrow.left { left: 0.5rem; }
      .hero-nav-arrow.right { right: 0.5rem; }
    }

    /* Bounding Box Wrapper for Zero Layout Shift */
    .hero-slider-wrapper {
      display: grid;
      grid-template-columns: 1fr;
      align-items: center;
      max-width: 900px;
      margin: 0 auto 2rem auto;
      min-height: 180px; /* Dedicated bounding box */
    }

    .hero-slide {
      grid-area: 1 / 1;
      opacity: 0;
      transform: translateY(8px);
      transition: opacity 450ms ease-out, transform 450ms ease-out, visibility 450ms ease-out;
      pointer-events: none;
      visibility: hidden;
    }

    .hero-slide.active {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
      visibility: visible;
    }

    .hero-header {
      color: #FFFFFF;
      font-size: 3rem;
      font-weight: 800;
      letter-spacing: -0.025em;
      line-height: 1.15;
      margin-bottom: 1rem;
    }

    .hero-subheader {
      color: #93B5D1;
      font-size: 1.2rem;
      font-weight: 400;
      line-height: 1.7;
      max-width: 750px;
      margin: 0 auto;
    }

    @media (max-width: 768px) {
      .hero-header { font-size: 2rem; }
      .hero-subheader { font-size: 1rem; }
      .hero-slider-wrapper { min-height: 220px; }
    }

    /* Slide Indicators / Dots */
    .dots-container {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 2.25rem;
    }

    .dot {
      background: rgba(255, 255, 255, 0.2);
      width: 8px;
      height: 6px;
      border-radius: 9999px;
      border: none;
      cursor: pointer;
      padding: 0;
      transition: all 300ms ease;
    }

    .dot:hover {
      background: rgba(255, 255, 255, 0.4);
    }

    .dot.active {
      background: #00D4B2;
      width: 32px;
      height: 6px;
      border-radius: 9999px;
    }

    /* Persistent Static Call-To-Action (CTA) Buttons */
    .hero-btn-group {
      display: flex;
      gap: 1.25rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn-cta-teal {
      border: 2px solid #00D4B2;
      color: #00D4B2;
      background: transparent;
      border-radius: 8px;
      padding: 0.75rem 1.75rem;
      font-weight: 600;
      font-size: 1.05rem;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-cta-teal:hover {
      background: rgba(0, 212, 178, 0.1);
      color: #00D4B2;
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0, 212, 178, 0.25);
    }

    /* Announcements Ticker */
    .ticker-wrap {
      background: #FFFFFF;
      border-bottom: 1px solid #E2E8F0;
      padding: 0.75rem 0;
      overflow: hidden;
      white-space: nowrap;
      box-shadow: 0 2px 5px rgba(0,0,0,0.03);
    }
    .ticker {
      display: inline-block;
      white-space: nowrap;
      animation: ticker 25s linear infinite;
    }
    .ticker-item {
      display: inline-block;
      padding: 0 2rem;
      color: #DC2626;
      font-weight: 700;
    }
    @keyframes ticker {
      0% { transform: translate3d(100%, 0, 0); }
      100% { transform: translate3d(-100%, 0, 0); }
    }

    /* Info Banner Section with Right-Side Dissolving Study Hall Slider */
    .info-banner {
      background: #031B33;
      position: relative;
      overflow: hidden;
      border-bottom: 1px solid #003366;
      min-height: 480px;
      display: flex;
      align-items: center;
    }

    .info-banner-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 4rem 1.5rem;
      width: 100%;
      display: flex;
      align-items: center;
      position: relative;
      z-index: 10;
    }

    .info-banner-left {
      max-width: 580px;
      text-align: left;
      z-index: 10;
    }

    .info-title {
      font-size: 2.3rem;
      font-weight: 800;
      color: #FFFFFF;
      letter-spacing: -0.02em;
      margin-bottom: 0.85rem;
      line-height: 1.2;
    }

    .info-subtitle {
      color: #93B5D1;
      font-size: 1.05rem;
      line-height: 1.65;
      margin-bottom: 2rem;
      font-weight: 400;
    }

    .info-bullets {
      display: flex;
      flex-direction: column;
      gap: 1.15rem;
    }

    .info-bullet-item {
      display: flex;
      align-items: flex-start;
      gap: 0.85rem;
    }

    .info-bullet-icon {
      color: #00D4B2;
      font-size: 1.15rem;
      font-weight: 900;
      flex-shrink: 0;
      margin-top: 1px;
      line-height: 1.3;
    }

    .info-bullet-text {
      display: flex;
      flex-direction: column;
    }

    .info-bullet-label {
      font-weight: 700;
      color: #FFFFFF;
      font-size: 1rem;
      margin-bottom: 0.15rem;
    }

    .info-bullet-desc {
      color: #93B5D1;
      font-size: 0.9rem;
      line-height: 1.4;
    }

    /* Right-side dissolving image slider */
    .info-banner-right-slider {
      position: absolute;
      top: 0;
      right: 0;
      width: 60%;
      height: 100%;
      z-index: 1;
      pointer-events: none;
      overflow: hidden;
    }

    .info-slide-img {
      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 1000ms ease-in-out;
    }

    .info-slide-img.active {
      opacity: 0.85;
    }

    /* Center transition dissolve gradient overlay */
    .info-dissolve-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: 
        linear-gradient(to right, #031B33 0%, #031B33 15%, rgba(3, 27, 51, 0.85) 35%, rgba(3, 27, 51, 0.4) 65%, transparent 100%),
        linear-gradient(to bottom, #031B33 0%, transparent 15%, transparent 85%, #031B33 100%);
      z-index: 2;
    }

    @media (max-width: 900px) {
      .info-banner-right-slider {
        width: 100%;
        opacity: 0.35;
      }
      .info-title { font-size: 1.85rem; }
      .info-banner-left { max-width: 100%; }
      .info-banner-container { padding: 3rem 1.25rem; }
    }

    /* Minimal Navigating Arrows & Dots for Info Banner */
    .info-nav-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: rgba(3, 27, 51, 0.85);
      border: 1.5px solid #00D4B2;
      color: #00D4B2;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 30;
      transition: all 250ms ease;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.35);
      outline: none;
      padding: 0;
    }

    .info-nav-arrow:hover {
      background: #00D4B2;
      color: #031B33;
      transform: translateY(-50%) scale(1.08);
      box-shadow: 0 0 15px rgba(0, 212, 178, 0.5);
    }

    .info-nav-arrow.left { left: 1.5rem; }
    .info-nav-arrow.right { right: 1.5rem; }

    @media (max-width: 768px) {
      .info-nav-arrow { width: 32px; height: 32px; }
      .info-nav-arrow.left { left: 0.5rem; }
      .info-nav-arrow.right { right: 0.5rem; }
    }

    .info-dots-container {
      position: absolute;
      bottom: 1.25rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      z-index: 30;
    }

    .info-dot {
      background: rgba(255, 255, 255, 0.25);
      width: 8px;
      height: 6px;
      border-radius: 9999px;
      border: none;
      cursor: pointer;
      padding: 0;
      transition: all 300ms ease;
    }

    .info-dot:hover {
      background: rgba(255, 255, 255, 0.5);
    }

    .info-dot.active {
      background: #00D4B2;
      width: 32px;
      height: 6px;
      border-radius: 9999px;
    }

    /* Hostel Section */
    .hostels-section {
      padding: 4rem 1.5rem 5rem 1.5rem;
      background: #00142A;
      border-bottom: 1px solid #003366;
      position: relative;
    }
    .hostels-section h2 { 
      text-align: center; 
      font-size: 2.3rem; 
      color: #FFFFFF; 
      margin-bottom: 0.5rem; 
      font-weight: 800; 
    }
    .section-subtitle {
      text-align: center;
      color: #8CA5BD;
      margin-bottom: 2rem;
      font-size: 1.05rem;
    }

    /* Filter Controls */
    .filter-bar {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 2.5rem;
      flex-wrap: wrap;
    }
    .filter-btn {
      background: rgba(0, 24, 50, 0.7);
      color: #8CA5BD;
      border: 1.5px solid #003366;
      padding: 0.6rem 1.5rem;
      border-radius: 30px;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.25s ease;
    }
    .filter-btn:hover {
      border-color: #00C7B6;
      color: #00C7B6;
    }
    .filter-btn.active {
      background: #00C7B6;
      color: #00142A;
      border-color: #00C7B6;
      font-weight: 700;
      box-shadow: 0 4px 15px rgba(0, 199, 182, 0.35);
    }

    /* Slider Container Wrapper */
    .slider-wrapper {
      position: relative;
      max-width: 1280px;
      margin: 0 auto;
      padding: 1rem 0;
    }

    .slider-container {
      display: flex;
      gap: 1.75rem;
      overflow-x: auto;
      scroll-behavior: smooth;
      padding: 1.25rem 0.5rem;
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE and Edge */
    }
    .slider-container::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera */
      width: 0;
      height: 0;
    }

    /* Slider Arrows */
    .slider-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #001832;
      border: 2px solid #00C7B6;
      color: #00C7B6;
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 20;
      transition: all 0.25s ease;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
    }
    .slider-arrow:hover {
      background: #00C7B6;
      color: #00142A;
      transform: translateY(-50%) scale(1.1);
      box-shadow: 0 6px 20px rgba(0, 199, 182, 0.5);
    }
    .slider-arrow.left { left: -20px; }
    .slider-arrow.right { right: -20px; }

    @media (max-width: 768px) {
      .slider-arrow.left { left: 5px; }
      .slider-arrow.right { right: 5px; }
    }

    /* Card Styling with Thin Seamless #00C7B6 Outline & Elevation */
    .card {
      flex: 0 0 340px;
      background: #FFFFFF;
      border: 1.5px solid #00C7B6; /* Thin seamless outline in requested color code #00C7B6 */
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 199, 182, 0.12);
      transition: transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.35s ease, border-color 0.35s ease;
      position: relative;
      box-sizing: border-box;
    }

    /* Elevate hostel card when cursor hovers over it */
    .card:hover {
      transform: translateY(-12px) scale(1.02);
      border-color: #00C7B6;
      box-shadow: 0 18px 36px rgba(0, 199, 182, 0.35), 0 0 15px rgba(0, 199, 182, 0.25);
      z-index: 10;
    }

    .card-img {
      height: 200px;
      background: #F1F5F9;
      background-size: cover;
      background-position: center;
      position: relative;
    }
    .card-img::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 40px;
      background: linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0));
    }

    .card-body {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      height: calc(100% - 200px);
      box-sizing: border-box;
    }

    .badge-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .badge {
      display: inline-block;
      padding: 0.3rem 0.85rem;
      border-radius: 50px;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .badge.male { background: #E3F2FD; color: #1565C0; border: 1px solid #90CAF9; }
    .badge.female { background: #FCE4EC; color: #C2185B; border: 1px solid #F48FB1; }

    .rating-badge {
      font-size: 0.85rem;
      font-weight: 700;
      color: #B45309;
      background: #FEF3C7;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .card-title {
      font-size: 1.2rem;
      font-weight: 800;
      margin-bottom: 0.75rem;
      color: #001832;
      line-height: 1.35;
      min-height: 3.2rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .card-info {
      font-size: 0.88rem;
      color: #475569;
      margin-bottom: 1rem;
    }
    .card-info p { 
      margin: 0.35rem 0; 
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .amenities {
      display: flex;
      gap: 0.4rem;
      flex-wrap: wrap;
      margin-bottom: 1.5rem;
      margin-top: auto;
      min-height: 2.8rem;
    }
    .amenity-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      background: #F0FDFA;
      border: 1px solid #99F6E4;
      padding: 0.25rem 0.55rem;
      border-radius: 6px;
      font-size: 0.75rem;
      color: #0F766E;
      font-weight: 600;
    }
    .amenity-icon {
      display: flex;
      align-items: center;
    }

    .btn-dark-details {
      display: inline-block;
      width: 100%;
      text-align: center;
      background: #001832;
      color: #FFFFFF;
      font-weight: 700;
      padding: 0.8rem 1.5rem;
      border-radius: 8px;
      text-decoration: none;
      border: 1.5px solid #00C7B6;
      transition: all 0.25s ease;
      box-sizing: border-box;
    }
    .btn-dark-details:hover {
      background: #00C7B6;
      border-color: #00C7B6;
      color: #00142A;
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0, 199, 182, 0.4);
    }

    /* What Our Residents Say Section */
    .reviews-banner-section {
      background: linear-gradient(180deg, #00142A 0%, #031B33 100%);
      padding: 4.5rem 1.5rem 4rem 1.5rem;
      border-top: 1px solid #003366;
      border-bottom: 1px solid #003366;
    }

    .section-header-wrap {
      text-align: center;
      max-width: 720px;
      margin: 0 auto 3rem auto;
    }

    .section-badge {
      display: inline-block;
      padding: 0.35rem 0.9rem;
      background: rgba(0, 212, 178, 0.12);
      border: 1px solid rgba(0, 212, 178, 0.3);
      border-radius: 9999px;
      color: #00D4B2;
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      margin-bottom: 0.75rem;
    }

    .section-heading {
      font-size: 2.3rem;
      font-weight: 800;
      color: #FFFFFF;
      margin-bottom: 0.75rem;
      letter-spacing: -0.02em;
    }

    .section-subheading {
      color: #8CA5BD;
      font-size: 1.05rem;
      line-height: 1.6;
    }

    .reviews-slider-wrapper {
      position: relative;
      max-width: 1280px;
      margin: 0 auto;
    }

    .reviews-slider-container {
      display: flex;
      gap: 1.5rem;
      overflow-x: auto;
      scroll-behavior: smooth;
      padding: 1rem 0.5rem 2rem 0.5rem;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .reviews-slider-container::-webkit-scrollbar {
      display: none;
    }

    .review-slide-card {
      flex: 0 0 380px;
      background: #001E3C;
      border: 1.5px solid #003366;
      border-radius: 16px;
      padding: 1.75rem;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.3s ease;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
    }

    .review-slide-card:hover {
      transform: translateY(-5px);
      border-color: #00D4B2;
      box-shadow: 0 12px 30px rgba(0, 212, 178, 0.15);
    }

    .quote-mark {
      position: absolute;
      top: 0.8rem;
      right: 1.5rem;
      font-size: 4rem;
      color: rgba(0, 212, 178, 0.1);
      font-family: Georgia, serif;
      pointer-events: none;
      line-height: 1;
    }

    .rev-card-header {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      margin-bottom: 1rem;
    }

    .avatar-badge {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: linear-gradient(135deg, #00D4B2 0%, #006699 100%);
      color: #00142A;
      font-weight: 800;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .meta { flex: 1; }
    .meta .name { font-size: 1.02rem; font-weight: 700; color: #FFFFFF; margin: 0 0 0.15rem 0; }
    .meta .dept { font-size: 0.8rem; color: #93B5D1; margin: 0; }

    .star-rating {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      background: rgba(251, 191, 36, 0.12);
      border: 1px solid rgba(251, 191, 36, 0.25);
      padding: 0.25rem 0.65rem;
      border-radius: 9999px;
      color: #FBBF24;
      font-weight: 800;
      font-size: 0.85rem;
    }

    .hostel-pill-link {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      align-self: flex-start;
      padding: 0.28rem 0.65rem;
      background: #002B55;
      border: 1px solid #004488;
      border-radius: 6px;
      color: #00D4B2;
      font-size: 0.78rem;
      font-weight: 600;
      text-decoration: none;
      margin-bottom: 1rem;
      transition: all 200ms ease;
    }

    .hostel-pill-link:hover {
      background: #00D4B2;
      color: #00142A;
    }

    .rev-comment {
      color: #E2E8F0;
      font-size: 0.92rem;
      line-height: 1.6;
      margin-bottom: 1.25rem;
      font-style: italic;
    }

    .rev-card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 0.85rem;
      border-top: 1px solid #002B55;
      font-size: 0.8rem;
    }

    .date-badge { color: #8CA5BD; }
    .read-all-link { color: #00D4B2; font-weight: 700; text-decoration: none; }
    .read-all-link:hover { text-decoration: underline; }

    .rev-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #001E3C;
      border: 1.5px solid #00D4B2;
      color: #00D4B2;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 10;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
      transition: all 0.25s ease;
    }

    .rev-arrow.left { left: -22px; }
    .rev-arrow.right { right: -22px; }
    .rev-arrow:hover { background: #00D4B2; color: #00142A; }

    .reviews-cta-bar {
      text-align: center;
      margin-top: 2rem;
    }

    .btn-all-reviews {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.85rem 2rem;
      background: linear-gradient(135deg, #00D4B2 0%, #00A389 100%);
      color: #00142A;
      font-weight: 800;
      font-size: 0.95rem;
      border-radius: 9999px;
      text-decoration: none;
      box-shadow: 0 4px 20px rgba(0, 212, 178, 0.35);
      transition: all 0.3s ease;
    }

    .btn-all-reviews:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 212, 178, 0.5);
    }

    @media (max-width: 768px) {
      .review-slide-card { flex: 0 0 300px; }
      .rev-arrow.left { left: 5px; }
      .rev-arrow.right { right: 5px; }
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  private publicService = inject(PublicService);
  private sanitizer = inject(DomSanitizer);

  @ViewChild('sliderContainer') sliderContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('reviewsSliderContainer') reviewsSliderContainer!: ElementRef<HTMLDivElement>;

  hostels: HostelSummary[] = [];
  announcements: Announcement[] = [];
  randomReviews: HostelReview[] = [];
  activeFilter: 'All' | 'Male' | 'Female' = 'All';

  // Hero Text Slider Dataset (5 Variants)
  heroSlides: HeroSlide[] = [
    {
      id: 1,
      theme: 'Core & Institutional',
      header: 'Your Hostel. Your Place. Your University.',
      subheader: 'Apply for hostel accommodation through a transparent, merit-based digital system. Experience comfortable living at the University of Sindh.'
    },
    {
      id: 2,
      theme: 'Modern & Streamlined',
      header: 'Smart Living. Seamless Allotment. Campus Life.',
      subheader: 'Easily apply for on-campus housing through an automated, fair, and digital portal designed for students of the University of Sindh.'
    },
    {
      id: 3,
      theme: 'Comfort & Community',
      header: 'Find Your Home Away From Home.',
      subheader: 'Secure your hostel accommodation with a fast, merit-driven online process and step into an engaging, supportive campus community.'
    },
    {
      id: 4,
      theme: 'Integrity & Efficiency',
      header: 'Effortless Allotment. Guaranteed Fairness.',
      subheader: 'A unified digital platform ensuring seamless, merit-based hostel reservations and safe, comfortable living across all university blocks.'
    },
    {
      id: 5,
      theme: 'Digital & Accessible',
      header: 'Your Room. Your Community. Simplified.',
      subheader: 'Eliminate paperwork with our automated allotment system—connecting you to secure, modern student housing in just a few clicks.'
    }
  ];

  currentSlideIndex = 0;
  isPaused = false;
  private autoSlideTimer: any = null;

  // Info Banner Dataset (5 Variants with Study Hall / Library Imagery)
  infoBannerSlides: InfoSlide[] = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
      title: 'University of Sindh Hostels',
      subtitle: 'Located across the scenic Jamshoro campus, our residential halls offer modern accommodation for both male and female scholars.',
      bullets: [
        { label: '100% Automated Process', desc: 'Digital merit calculation eliminating paper delays.' },
        { label: 'Real-Time Room Status', desc: 'Instant tracking of capacity, vacancy, and floor plans.' },
        { label: 'Direct Fee Processing', desc: 'Secure challan generation and verification online.' }
      ]
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=1200&q=80',
      title: 'Safe, Comfortable & Student-Centric',
      subtitle: 'Dedicated residential blocks designed to provide peace of mind, high security, and a productive environment for academic focus.',
      bullets: [
        { label: '24/7 Security Protocols', desc: 'Gated perimeters, CCTV coverage, and dedicated wardens.' },
        { label: 'Modern Utility Access', desc: 'High-speed campus Wi-Fi, RO filtered water, and power backup.' },
        { label: 'Dedicated Dining', desc: 'Subsidized mess facilities with daily monitored hygienic meals.' }
      ]
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
      title: 'Designed for Academic Focus',
      subtitle: 'Experience living spaces crafted to support late-night study sessions, group discussions, and research work.',
      bullets: [
        { label: 'Quiet Study Halls', desc: 'Dedicated air-conditioned reading halls inside hostel premises.' },
        { label: 'Close to Departments', desc: 'Walking distance to main academic faculties and central library.' },
        { label: 'Research-Friendly Blocks', desc: 'Low-occupancy wings tailored for postgraduate scholars.' }
      ]
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
      title: 'A Thriving Student Community',
      subtitle: 'Join thousands of students from diverse regions, building lifelong connections and engaging in campus life.',
      bullets: [
        { label: 'Recreational Lounges', desc: 'Common rooms equipped with TV, table tennis, and indoor games.' },
        { label: 'Sports & Grounds Access', desc: 'Immediate access to central campus sports complexes and fields.' },
        { label: 'Student Support Desk', desc: 'Dedicated hostel administration for quick dispute and query resolution.' }
      ]
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
      title: 'Effortless Online Room Allotment',
      subtitle: 'Skip long queues and paperwork with our direct portal connecting you to comfortable student housing in just a few clicks.',
      bullets: [
        { label: 'Instant Eligibility Check', desc: 'Apply with your student roll number in under 2 minutes.' },
        { label: 'Transparent Allotment Lists', desc: 'Public, tamper-proof merit lists published every session.' },
        { label: 'Hostel Switch & Requests', desc: 'Streamlined online applications for room transfers and renewals.' }
      ]
    }
  ];

  currentInfoSlideIndex = 0;
  private infoSlideTimer: any = null;

  ngOnInit() {
    this.startHeroAutoSlide();
    this.startInfoBannerTimer();

    this.publicService.getHostels().subscribe({
      next: (data) => this.hostels = data,
      error: (err) => console.error('Failed to load hostels', err)
    });

    this.publicService.getAnnouncements().subscribe({
      next: (data) => this.announcements = data,
      error: (err) => console.error('Failed to load announcements', err)
    });

    this.publicService.getRandomReviews(10).subscribe({
      next: (data) => this.randomReviews = data,
      error: (err) => console.error('Failed to load random reviews', err)
    });
  }

  ngOnDestroy() {
    this.stopHeroAutoSlide();
    this.stopInfoBannerTimer();
  }

  // Info Banner Auto Slide Logic (5000ms crossfade cycle)
  startInfoBannerTimer() {
    this.stopInfoBannerTimer();
    this.infoSlideTimer = setInterval(() => {
      this.currentInfoSlideIndex = (this.currentInfoSlideIndex + 1) % this.infoBannerSlides.length;
    }, 5000);
  }

  stopInfoBannerTimer() {
    if (this.infoSlideTimer) {
      clearInterval(this.infoSlideTimer);
      this.infoSlideTimer = null;
    }
  }

  prevInfoSlide() {
    this.currentInfoSlideIndex = (this.currentInfoSlideIndex - 1 + this.infoBannerSlides.length) % this.infoBannerSlides.length;
    this.startInfoBannerTimer();
  }

  nextInfoSlideManual() {
    this.currentInfoSlideIndex = (this.currentInfoSlideIndex + 1) % this.infoBannerSlides.length;
    this.startInfoBannerTimer();
  }

  goToInfoSlide(index: number) {
    this.currentInfoSlideIndex = index;
    this.startInfoBannerTimer();
  }

  // Hero Auto Slider Logic (5500ms cycle)
  startHeroAutoSlide() {
    this.stopHeroAutoSlide();
    this.autoSlideTimer = setInterval(() => {
      if (!this.isPaused) {
        this.nextSlide();
      }
    }, 5500);
  }

  stopHeroAutoSlide() {
    if (this.autoSlideTimer) {
      clearInterval(this.autoSlideTimer);
      this.autoSlideTimer = null;
    }
  }

  nextSlide() {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.heroSlides.length;
  }

  prevSlide() {
    this.currentSlideIndex = (this.currentSlideIndex - 1 + this.heroSlides.length) % this.heroSlides.length;
    this.startHeroAutoSlide();
  }

  nextSlideManual() {
    this.nextSlide();
    this.startHeroAutoSlide();
  }

  goToSlide(index: number) {
    this.currentSlideIndex = index;
    this.startHeroAutoSlide();
  }

  scrollToHostels(event: Event) {
    event.preventDefault();
    const hostelsElement = document.getElementById('hostels');
    if (hostelsElement) {
      hostelsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  pauseHeroSlider() {
    this.isPaused = true;
  }

  resumeHeroSlider() {
    this.isPaused = false;
  }

  get filteredHostels(): HostelSummary[] {
    if (this.activeFilter === 'All') {
      return this.hostels;
    }
    return this.hostels.filter(h => h.gender.toLowerCase() === this.activeFilter.toLowerCase());
  }

  setFilter(filter: 'All' | 'Male' | 'Female') {
    this.activeFilter = filter;
    if (this.sliderContainer) {
      this.sliderContainer.nativeElement.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }

  scrollSlider(direction: 'left' | 'right') {
    if (this.sliderContainer) {
      const scrollAmount = 360;
      const currentScroll = this.sliderContainer.nativeElement.scrollLeft;
      this.sliderContainer.nativeElement.scrollTo({
        left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }
  }

  getAmenityIcon(amenity: string): SafeHtml {
    const a = amenity.toLowerCase();
    let svg = '';
    if (a.includes('wifi') || a.includes('internet')) {
      svg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>`;
    } else if (a.includes('mess') || a.includes('dining') || a.includes('cafeteria') || a.includes('food')) {
      svg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>`;
    } else if (a.includes('security') || a.includes('cctv') || a.includes('guarded') || a.includes('gate')) {
      svg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`;
    } else if (a.includes('study') || a.includes('reading') || a.includes('library')) {
      svg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`;
    } else if (a.includes('water') || a.includes('plant') || a.includes('filter') || a.includes('ro')) {
      svg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>`;
    } else if (a.includes('laundry')) {
      svg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="2" width="18" height="20" rx="2"></rect><circle cx="12" cy="13" r="5"></circle><line x1="8" y1="6" x2="8.01" y2="6"></line><line x1="12" y1="6" x2="12.01" y2="6"></line></svg>`;
    } else if (a.includes('generator') || a.includes('power') || a.includes('backup')) {
      svg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`;
    } else if (a.includes('bath') || a.includes('bathroom') || a.includes('attached')) {
      svg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1z"></path><path d="M6 12V5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2"></path></svg>`;
    } else if (a.includes('sport') || a.includes('game') || a.includes('ground') || a.includes('gym')) {
      svg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>`;
    } else {
      svg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    }
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  scrollReviewSlider(direction: 'left' | 'right') {
    if (this.reviewsSliderContainer) {
      const scrollAmount = 400;
      const currentScroll = this.reviewsSliderContainer.nativeElement.scrollLeft;
      this.reviewsSliderContainer.nativeElement.scrollTo({
        left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }
  }

  getInitials(name: string): string {
    if (!name) return 'S';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }
}

