import { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2, LocateFixed, MapPin, Search, X } from 'lucide-react';

const DEFAULT_CENTER = { lat: 22.7196, lng: 75.8577 }; // Indore, used only as a neutral fallback
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

let googleMapsLoadPromise = null;
const loadGoogleMaps = () => {
    if (window.google?.maps?.places) return Promise.resolve(window.google);
    if (googleMapsLoadPromise) return googleMapsLoadPromise;

    googleMapsLoadPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        // NOTE: do not add &loading=async here without also switching to
        // google.maps.importLibrary() - with that flag set, google.maps.Map/
        // Marker/Geocoder/places.* are not guaranteed defined just because
        // script.onload fired, which crashed this modal (and, with no error
        // boundary above it, the entire page) with "google.maps.Map is not a
        // constructor".
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.onload = () => resolve(window.google);
        script.onerror = () => reject(new Error('Failed to load Google Maps'));
        document.head.appendChild(script);
    });
    return googleMapsLoadPromise;
};

const isPlusCode = (value = '') => /\b[A-Z0-9]{4,8}\+[A-Z0-9]{2,3}\b/i.test(String(value));

// Mirrors the Expo app's LocationMapPicker.parseAddressComponents so both
// pickers resolve a Google geocode result into the same {address, city,
// state, pincode} shape the backend branch form expects.
const parseAddressComponents = (components = [], fallbackFormattedAddress = '') => {
    const get = (type) => components.find((c) => c.types.includes(type))?.long_name || '';
    const sublocality = get('sublocality_level_1') || get('sublocality') || get('neighborhood');
    const streetLine = [get('street_number'), get('route')].filter(Boolean).join(' ');
    const city = get('locality') || get('administrative_area_level_2');
    const state = get('administrative_area_level_1');
    const pincode = get('postal_code');
    const standardAddress = [get('premise') || get('establishment'), streetLine, sublocality, city, state, pincode]
        .filter((part, index, parts) => part && !isPlusCode(part) && parts.indexOf(part) === index)
        .join(', ');

    return { address: standardAddress || fallbackFormattedAddress, city, state, pincode };
};

// Web equivalent of the Expo app's LocationMapPicker: search (Places
// Autocomplete), "use current location", and click-to-place-pin, all
// reverse-geocoded via the Google Maps JS API - same VITE_GOOGLE_MAPS_API_KEY
// as the mobile app (see squarft-admin/.env).
export default function LocationPickerModal({ isOpen, onClose, onConfirm, initial, title = 'Set Location' }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const mapContainerRef = useRef(null);
    const markerRef = useRef(null);
    const geocoderRef = useRef(null);
    const autocompleteServiceRef = useRef(null);
    const placesServiceRef = useRef(null);
    const sessionTokenRef = useRef(null);
    const searchDebounceRef = useRef(null);
    const applyPositionRef = useRef(null);

    const [mapsReady, setMapsReady] = useState(!!window.google?.maps?.places);
    const [mapsError, setMapsError] = useState(false);
    const [position, setPosition] = useState(null);
    const [resolved, setResolved] = useState(null);
    const [resolving, setResolving] = useState(false);
    const [locating, setLocating] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        loadGoogleMaps()
            .then(() => setMapsReady(true))
            .catch(() => setMapsError(true));
    }, [isOpen]);

    const applyPosition = useCallback(async (lat, lng, map, google) => {
        setPosition({ lat, lng });
        if (markerRef.current) {
            markerRef.current.setPosition({ lat, lng });
        } else if (map && google) {
            markerRef.current = new google.maps.Marker({ position: { lat, lng }, map, draggable: true });
            markerRef.current.addListener('dragend', (event) => {
                applyPositionRef.current?.(event.latLng.lat(), event.latLng.lng(), mapInstanceRef.current, window.google);
            });
        }

        setResolving(true);
        try {
            const response = await geocoderRef.current.geocode({ location: { lat, lng } });
            const preferredResult = response.results.find((result) =>
                result.types?.some((type) => ['street_address', 'premise', 'subpremise', 'establishment', 'route'].includes(type))
                && !isPlusCode(result.formatted_address)
            ) || response.results.find((result) => !isPlusCode(result.formatted_address));

            setResolved(preferredResult ? parseAddressComponents(preferredResult.address_components, preferredResult.formatted_address) : null);
        } catch {
            setResolved(null);
        } finally {
            setResolving(false);
        }
    }, []);

    useEffect(() => {
        applyPositionRef.current = applyPosition;
    }, [applyPosition]);

    useEffect(() => {
        // Guard on the actual DOM node the map is bound to, not just "is there
        // a map instance" - React 19/StrictMode double-invokes effects in dev,
        // and a cleanup here that nulled mapInstanceRef.current made the guard
        // useless: the second invocation would create a *second*
        // google.maps.Map on the SAME still-mounted node before the first
        // instance finished its internal (async) setup, which crashed with
        // "Failed to execute 'observe' on 'IntersectionObserver'" deep inside
        // Google's bundle. Google Maps has no supported "destroy and recreate
        // on the same node" API, so the fix is to never do that - only
        // (re)create the map when the container node itself is new (i.e. the
        // modal was actually closed and reopened, not just double-invoked).
        if (!isOpen || !mapsReady || mapContainerRef.current === mapRef.current) return;
        const google = window.google;
        const start = initial?.latitude && initial?.longitude
            ? { lat: initial.latitude, lng: initial.longitude }
            : DEFAULT_CENTER;

        const map = new google.maps.Map(mapRef.current, {
            center: start,
            zoom: initial?.latitude ? 14 : 5,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
        });
        map.addListener('click', (event) => applyPosition(event.latLng.lat(), event.latLng.lng(), map, google));

        mapInstanceRef.current = map;
        mapContainerRef.current = mapRef.current;
        geocoderRef.current = new google.maps.Geocoder();
        autocompleteServiceRef.current = new google.maps.places.AutocompleteService();
        placesServiceRef.current = new google.maps.places.PlacesService(map);
        sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();

        if (initial?.latitude && initial?.longitude) {
            applyPosition(initial.latitude, initial.longitude, map, google);
        }
    }, [isOpen, mapsReady, initial, applyPosition]);

    useEffect(() => {
        if (!isOpen) {
            setPosition(null);
            setResolved(null);
            setSearchQuery('');
            setSearchResults([]);
            // The modal returns null (unmounting mapRef's div) whenever isOpen
            // is false, so the container node is gone - reset these refs here
            // (a real close), not in the init effect's cleanup, so a genuine
            // reopen creates a fresh map on the new node while StrictMode's
            // same-node double-invoke above is left alone.
            markerRef.current?.setMap(null);
            markerRef.current = null;
            mapInstanceRef.current = null;
            mapContainerRef.current = null;
        }
    }, [isOpen]);

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) return;
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocating(false);
                const { latitude, longitude } = pos.coords;
                mapInstanceRef.current?.setCenter({ lat: latitude, lng: longitude });
                mapInstanceRef.current?.setZoom(15);
                applyPosition(latitude, longitude, mapInstanceRef.current, window.google);
            },
            () => setLocating(false),
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handleSearchChange = (value) => {
        setSearchQuery(value);
        if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
        if (!value.trim()) {
            setSearchResults([]);
            return;
        }
        searchDebounceRef.current = setTimeout(() => {
            if (!autocompleteServiceRef.current) return;
            setSearching(true);
            autocompleteServiceRef.current.getPlacePredictions(
                { input: value, componentRestrictions: { country: 'in' }, sessionToken: sessionTokenRef.current },
                (predictions, status) => {
                    setSearching(false);
                    setSearchResults(status === window.google.maps.places.PlacesServiceStatus.OK && predictions ? predictions : []);
                }
            );
        }, 350);
    };

    const handleSelectResult = (prediction) => {
        setSearchResults([]);
        setSearchQuery(prediction.description);
        placesServiceRef.current.getDetails(
            { placeId: prediction.place_id, fields: ['geometry', 'address_component', 'formatted_address'], sessionToken: sessionTokenRef.current },
            (place, status) => {
                sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
                if (status !== window.google.maps.places.PlacesServiceStatus.OK || !place?.geometry?.location) return;
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                mapInstanceRef.current?.setCenter({ lat, lng });
                mapInstanceRef.current?.setZoom(15);
                if (markerRef.current) {
                    markerRef.current.setPosition({ lat, lng });
                } else {
                    markerRef.current = new window.google.maps.Marker({ position: { lat, lng }, map: mapInstanceRef.current, draggable: true });
                    markerRef.current.addListener('dragend', (event) => {
                        applyPositionRef.current?.(event.latLng.lat(), event.latLng.lng(), mapInstanceRef.current, window.google);
                    });
                }
                setPosition({ lat, lng });
                setResolved(parseAddressComponents(place.address_components, place.formatted_address));
            }
        );
    };

    const handleConfirm = () => {
        if (!position) return;
        onConfirm({
            latitude: position.lat,
            longitude: position.lng,
            address: resolved?.address || '',
            city: resolved?.city || '',
            state: resolved?.state || '',
            pincode: resolved?.pincode || '',
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-110 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50 shrink-0">
                    <h3 className="font-black text-lg text-gray-900">{title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-xl text-gray-500 transition-colors bg-white border border-gray-100">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-5 space-y-3">
                    {mapsError ? (
                        <div className="bg-rose-50 border border-rose-100 rounded-lg p-4 text-sm font-bold text-rose-600">
                            Could not load Google Maps. Check your connection and the configured API key.
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            {/* Google Maps' own zoom/map-type controls sit inside the map div at a high
                                z-index, so this needs to clear that, not just tie with it - an equal
                                z-index falls back to DOM order, which would let the map's controls
                                poke through the dropdown since the map renders after it. */}
                            <div className="relative flex-1 z-1100">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    disabled={!mapsReady}
                                    placeholder="Search for an area, street, or landmark..."
                                    className="w-full border border-gray-300 rounded-lg p-3 pl-9 outline-none focus:ring-2 focus:ring-[#6F4BFF]/50 font-bold text-sm disabled:bg-gray-50"
                                />
                                {searching && <Loader2 className="w-4 h-4 text-gray-400 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />}
                                {searchResults.length > 0 && (
                                    <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto">
                                        {searchResults.map((result) => (
                                            <button
                                                type="button"
                                                key={result.place_id}
                                                onClick={() => handleSelectResult(result)}
                                                className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border-b border-gray-50 last:border-0"
                                            >
                                                {result.description}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={handleUseCurrentLocation}
                                disabled={locating || !mapsReady}
                                className="flex items-center gap-2 px-4 rounded-lg border border-gray-300 font-bold text-sm text-[#6F4BFF] hover:bg-[#6F4BFF]/5 shrink-0 disabled:opacity-50"
                            >
                                {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <LocateFixed className="w-4 h-4" />}
                                Current Location
                            </button>
                        </div>
                    )}

                    <div className="relative w-full h-80 rounded-xl border border-gray-200 bg-gray-100 overflow-hidden">
                        {!mapsReady && !mapsError && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                            </div>
                        )}
                        <div ref={mapRef} className="w-full h-full" />
                    </div>

                    <div className="flex items-start gap-2 bg-gray-50 border border-gray-100 rounded-lg p-3 min-h-14">
                        <MapPin className="w-4 h-4 text-[#6F4BFF] shrink-0 mt-0.5" />
                        <p className="text-sm font-bold text-gray-700">
                            {!position
                                ? 'Search, use your current location, or click the map to drop a pin.'
                                : resolving
                                    ? 'Resolving address...'
                                    : resolved?.address || 'Address unavailable — coordinates captured.'}
                        </p>
                    </div>
                </div>

                <div className="p-5 border-t border-gray-100 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-lg font-bold text-sm text-gray-600 hover:bg-gray-100">
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={!position}
                        className="px-5 py-2.5 rounded-lg font-bold text-sm text-white bg-[#6F4BFF] hover:bg-[#5d3fe0] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Confirm Location
                    </button>
                </div>
            </div>
        </div>
    );
}
