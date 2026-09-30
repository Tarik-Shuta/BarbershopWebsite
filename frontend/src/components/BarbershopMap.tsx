import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const SHOP_COORDINATES: [number, number] = [
    18.30542709242597,
    43.83145874040907,
];

const GOOGLE_MAPS_URL =
    "https://www.google.com/maps/dir/?api=1&destination=43.83145874040907,18.30542709242597";

export default function BarbershopMap() {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) {
            return;
        }

        const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

        if (!accessToken) {
            console.error("Missing VITE_MAPBOX_ACCESS_TOKEN");
            return;
        }

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            accessToken,

            style: "mapbox://styles/mapbox/standard",

            center: SHOP_COORDINATES,
            zoom: 15.5,

            pitch: 35,
            bearing: -10,

            scrollZoom: false,

            config: {
                basemap: {
                    lightPreset: "dusk",
                    showPointOfInterestLabels: true,
                    showTransitLabels: true,
                },
            },
        });

        mapRef.current = map;

        map.addControl(
            new mapboxgl.NavigationControl({
                visualizePitch: true,
            }),
            "top-right",
        );

        /*
         * Create custom marker content.
         * Use a simple div and let Mapbox make it the marker element.
         */
        const markerContent = document.createElement("div");

        markerContent.innerHTML = `
            <div
                class="urban-marker-content"
                style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 7px;
                    transition: transform 200ms ease;
                "
            >
                <div
                    style="
                        padding: 8px 13px;
                        border-radius: 9999px;

                        background: rgba(4, 20, 38, 0.90);
                        border: 1px solid rgba(255, 255, 255, 0.14);

                        color: white;

                        font-family:
                            system-ui,
                            -apple-system,
                            sans-serif;

                        font-size: 12px;
                        font-weight: 600;

                        white-space: nowrap;

                        backdrop-filter: blur(12px);

                        box-shadow:
                            0 10px 30px rgba(0, 0, 0, 0.35);
                    "
                >
                    Urban Barbershop

                    <span
                        style="
                            display: block;
                            margin-top: 2px;

                            color: rgba(255, 255, 255, 0.6);

                            font-size: 9px;
                            font-weight: 500;
                            letter-spacing: 0.04em;
                        "
                    >
                        Otvori navigaciju ↗
                    </span>
                </div>

                <div
                    style="
                        width: 20px;
                        height: 20px;

                        border-radius: 50%;

                        background: #22d3ee;
                        border: 3px solid white;

                        box-shadow:
                            0 0 0 5px rgba(34, 211, 238, 0.15),
                            0 0 22px rgba(34, 211, 238, 0.65);
                    "
                ></div>
            </div>
        `;

        /*
         * Create marker FIRST.
         */
        const marker = new mapboxgl.Marker({
            element: markerContent,
            anchor: "bottom",

            // Allows a tiny amount of mouse movement
            // without Mapbox treating it as a drag.
            clickTolerance: 8,
        })
            .setLngLat(SHOP_COORDINATES)
            .addTo(map);

        /*
         * IMPORTANT:
         * Get the actual DOM element Mapbox is using.
         */
        const markerElement = marker.getElement();

        markerElement.style.cursor = "pointer";
        markerElement.style.pointerEvents = "auto";
        markerElement.style.zIndex = "20";

        markerElement.setAttribute("tabindex", "0");
        markerElement.setAttribute("role", "link");

        markerElement.setAttribute(
            "aria-label",
            "Otvori Google Maps navigaciju do Urban Barbershopa",
        );

        const visualElement =
            markerElement.querySelector(
                ".urban-marker-content",
            ) as HTMLElement | null;

        const openGoogleMaps = () => {
            window.open(
                GOOGLE_MAPS_URL,
                "_blank",
                "noopener,noreferrer",
            );
        };

        /*
         * Click
         */
        markerElement.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            openGoogleMaps();
        });

        /*
         * Keyboard accessibility
         */
        markerElement.addEventListener("keydown", (event) => {
            if (
                event.key === "Enter" ||
                event.key === " "
            ) {
                event.preventDefault();

                openGoogleMaps();
            }
        });

        /*
         * Hover animation
         */
        markerElement.addEventListener("mouseenter", () => {
            if (visualElement) {
                visualElement.style.transform =
                    "translateY(-3px) scale(1.04)";
            }
        });

        markerElement.addEventListener("mouseleave", () => {
            if (visualElement) {
                visualElement.style.transform =
                    "translateY(0) scale(1)";
            }
        });

        /*
         * Keep the map correctly sized.
         */
        const resizeObserver = new ResizeObserver(() => {
            map.resize();
        });

        resizeObserver.observe(mapContainerRef.current);

        return () => {
            resizeObserver.disconnect();

            marker.remove();
            map.remove();

            mapRef.current = null;
        };
    }, []);

    return (
        <div
            ref={mapContainerRef}
            className="relative z-10 h-full min-h-100 w-full"
        />
    );
}