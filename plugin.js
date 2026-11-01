// Windy Plugin – Aurora Botnia Tracker (Digitraffic)
// Single-file version for GitHub Pages

(function () {
    const MMSI = 230040000;
    const ENDPOINT = `https://meri.digitraffic.fi/api/ais/v1/locations?mmsi=${MMSI}`;

    let marker = null;
    let trail = null;
    let trailPoints = [];
    let timer = null;
    let follow = true;

    const boatIcon = L.divIcon({
        html: `<svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.784,13.635c0,0 -0.106,-2.924 0.006,-4.379c0.115,-1.502 0.318,-3.151 0.686,-4.632c0.163,-0.654 0.45,-1.623 0.755,-2.44c0.202,-0.54 0.407,-1.021 0.554,-1.352c0.038,-0.085 0.122,-0.139 0.215,-0.139c0.092,0 0.176,0.054 0.214,0.139c0.151,0.342 0.361,0.835 0.555,1.352c0.305,0.817 0.592,1.786 0.755,2.44c0.368,1.481 0.571,3.13 0.686,4.632c0.112,1.455 0.006,4.379 0.006,4.379l-4.432,0Z" style="fill:#0b5fff;"/>
            <path d="M5.481,12.731c0,0 -0.073,-3.048 0.003,-4.22c0.06,-0.909 0.886,-3.522 1.293,-4.764c0.03,-0.098 0.121,-0.165 0.223,-0.165c0.103,0 0.193,0.067 0.224,0.164c0.406,1.243 1.232,3.856 1.292,4.765c0.076,1.172 0.003,4.22 0.003,4.22l-3.038,0Z" style="fill:#fff;fill-opacity:0.85;"/>
        </svg>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        className: 'aurora-botnia-icon'
    });

    function updateRotation(heading) {
        if (!marker || !marker._icon) return;
        const icon = marker._icon;
        icon.style.transformOrigin = '14px 14px';
        let t = icon.style.transform || '';
        if (t.indexOf('rotateZ') === -1) {
            icon.style.transform = t + ` rotateZ(${heading}deg)`;
        } else {
            icon.style.transform = t.replace(/rotateZ\([^)]+\)/, `rotateZ(${heading}deg)`);
        }
    }

    function setPosition(lat, lon, heading, speed, cog) {
        const latlng = [lat, lon];

        if (!marker) {
            marker = L.marker(latlng, { icon: boatIcon }).addTo(W.maps.map);
            marker.bindPopup(`
                <b>AURORA BOTNIA</b><br>
                Speed: ${speed.toFixed(1)} kn<br>
                Course: ${Math.round(cog)}°<br>
                Heading: ${heading}°
            `);
        } else {
            marker.setLatLng(latlng);
            marker.setPopupContent(`
                <b>AURORA BOTNIA</b><br>
                Speed: ${speed.toFixed(1)} kn<br>
                Course: ${Math.round(cog)}°<br>
                Heading: ${heading}°
            `);
        }

        trailPoints.push(latlng);
        if (trailPoints.length > 40) trailPoints.shift();

        if (trail) {
            trail.setLatLngs(trailPoints);
        } else {
            trail = L.polyline(trailPoints, {
                color: '#0b5fff',
                weight: 3,
                opacity: 0.75
            }).addTo(W.maps.map);
        }

        if (follow) {
            W.maps.map.setView(latlng, Math.max(W.maps.map.getZoom(), 9));
        }

        updateRotation(heading);
    }

    async function fetchPosition() {
        try {
            const res = await fetch(ENDPOINT, {
                headers: {
                    'Digitraffic-User': 'WindyPlugin-AuroraBotnia/1.0',
                    'Accept': 'application/json'
                },
                cache: 'no-store'
            });
            if (!res.ok) throw new Error('HTTP ' + res.status);

            const data = await res.json();
            if (!data.features || !data.features.length) {
                console.warn('No position for Aurora Botnia');
                return;
            }

            const f = data.features[0];
            const [lon, lat] = f.geometry.coordinates;
            const p = f.properties;

            setPosition(
                lat,
                lon,
                p.heading || p.cog || 0,
                p.sog || 0,
                p.cog || 0
            );
        } catch (err) {
            console.error('Aurora Botnia tracker error:', err);
        }
    }

    // Plugin entry points required by Windy
    window.windyPlugin = {
        onopen: function () {
            console.log('Aurora Botnia tracker opened');
            fetchPosition();
            timer = setInterval(fetchPosition, 60000);
        },
        onclose: function () {
            if (timer) clearInterval(timer);
            if (marker) W.maps.map.removeLayer(marker);
            if (trail) W.maps.map.removeLayer(trail);
            marker = null;
            trail = null;
            trailPoints = [];
        }
    };
})();
