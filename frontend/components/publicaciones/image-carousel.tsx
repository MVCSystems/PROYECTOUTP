"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface Imagen {
  id: number;
  imagen: string;
  descripcion: string;
  orden: number;
}

export function ImageCarousel({ imagenes }: { imagenes: Imagen[] }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const sortedImages = [...imagenes].sort((a, b) => a.orden - b.orden);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % sortedImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + sortedImages.length) % sortedImages.length
    );
  };

  const nextFullscreenImage = () => {
    if (fullscreenIndex !== null) {
      setFullscreenIndex((prev) => ((prev ?? 0) + 1) % sortedImages.length);
    }
  };

  const prevFullscreenImage = () => {
    if (fullscreenIndex !== null) {
      setFullscreenIndex(
        (prev) => ((prev ?? 0) - 1 + sortedImages.length) % sortedImages.length
      );
    }
  };

  const openFullscreen = (index: number) => {
    setFullscreenIndex(index);
    // Prevent scrolling when fullscreen is open
    document.body.style.overflow = "hidden";
  };

  const closeFullscreen = () => {
    setFullscreenIndex(null);
    // Restore scrolling
    document.body.style.overflow = "auto";
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (fullscreenIndex === null) return;

    if (e.key === "ArrowRight") {
      nextFullscreenImage();
    } else if (e.key === "ArrowLeft") {
      prevFullscreenImage();
    } else if (e.key === "Escape") {
      closeFullscreen();
    }
  };

  if (sortedImages.length === 0) {
    return null;
  }

  // Calculate visible range for carousel
  const visibleImages = [];
  for (let i = 0; i < sortedImages.length; i++) {
    visibleImages.push((currentImageIndex + i) % sortedImages.length);
  }

  return (
    <div className="space-y-6">
      {/* Main carousel */}
      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {visibleImages.slice(0, 4).map((index) => (
            <div
              key={sortedImages[index].id}
              className="aspect-video bg-muted relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border-2"
              onClick={() => openFullscreen(index)}
            >
              <Image
                src={sortedImages[index].imagen || "/placeholder.svg"}
                alt={sortedImages[index].descripcion}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300"></div>
            </div>
          ))}
        </div>

        {sortedImages.length > 4 && (
          <div className="absolute inset-y-0 flex items-center justify-between w-full pointer-events-none">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full shadow-lg pointer-events-auto opacity-80 hover:opacity-100 transition-opacity duration-300 -ml-3 z-10"
              onClick={prevImage}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full shadow-lg pointer-events-auto opacity-80 hover:opacity-100 transition-opacity duration-300 -mr-3 z-10"
              onClick={nextImage}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        )}
      </div>

      {/* Fullscreen viewer */}
      {fullscreenIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={closeFullscreen}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8">
            <div
              className="relative max-w-7xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video max-h-[80dvh] w-auto max-w-[80dvw] min-h-[30dvh] md:min-h-[50dvh] lg:min-h-[60dvh] xl:min-h-[70dvh]">
                {/* <img src={sortedImages[fullscreenIndex].imagen} alt="" /> */}
                <Image
                  src={sortedImages[fullscreenIndex].imagen}
                  alt={sortedImages[fullscreenIndex].descripcion}
                  fill
                  className="object-contain animate-fadeIn"
                  sizes="(max-width: 768px) 100vw, 80vw"
                  priority
                />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/50 text-white rounded-b-lg">
                <p className="text-center">
                  {sortedImages[fullscreenIndex].descripcion}
                </p>
                <p className="text-center text-sm text-gray-300 mt-1">
                  {fullscreenIndex + 1} / {sortedImages.length}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors duration-300"
              onClick={closeFullscreen}
            >
              <X className="h-6 w-6" />
            </Button>

            <div className="absolute inset-y-0 left-0 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors duration-300 ml-2 md:ml-6"
                onClick={(e) => {
                  e.stopPropagation();
                  prevFullscreenImage();
                }}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
            </div>

            <div className="absolute inset-y-0 right-0 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors duration-300 mr-2 md:mr-6"
                onClick={(e) => {
                  e.stopPropagation();
                  nextFullscreenImage();
                }}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Thumbnails/indicators
      {sortedImages.length > 4 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: Math.ceil(sortedImages.length / 4) }).map(
            (_, groupIndex) => (
              <Button
                key={groupIndex}
                variant={
                  Math.floor(currentImageIndex / 4) === groupIndex
                    ? "default"
                    : "outline"
                }
                size="icon"
                className={cn(
                  "w-8 h-8 rounded-full transition-all duration-300",
                  Math.floor(currentImageIndex / 4) === groupIndex
                    ? "scale-110"
                    : ""
                )}
                onClick={() => setCurrentImageIndex(groupIndex * 4)}
              >
                <span className="sr-only">Grupo {groupIndex + 1}</span>
              </Button>
            )
          )}
        </div>
      )} */}
    </div>
  );
}
