# PromptAir-Logo im Silver-Applications-Stil: flach, scharfkantig, Silber + Petrol
# Variante A: Silberne Textzeilen formen ein Play-Dreieck, die mittlere (längste) Zeile
# ist die Leselinie in Petrol; links davon die "Air"-Echo-Linien.
A900 = '#15181B'; A700 = '#1E2328'; GRAPHIT = '#3A4148'
S300 = '#9BA3AB'; S100 = '#D9DDE1'; WHITE = '#F4F5F6'
P300 = '#3FA893'; P500 = '#1D7A6E'

BARS = [(30, 16.5, 12), (30, 26.5, 24), (30, 36.5, 36), (30, 46.5, 48),
        (30, 56.5, 36), (30, 66.5, 24), (30, 76.5, 12)]
GHOST = [(14, 28.5, 9), (10, 38.5, 13), (7, 48.5, 16), (10, 58.5, 13), (14, 68.5, 9)]
CX, CY = 42.5, 50          # Mitte der Bildmarke (x 7..78, y 16.5..83.5)
MARK_VIEWBOX = "5 14 76 72"


def mark(mono=None):
    """SVG-Rechtecke der Bildmarke (Koordinaten im 100er-Raster)."""
    out = []
    for i, (x, y, w) in enumerate(BARS):
        c = mono or (P300 if i == 3 else S100)
        out.append(f'<rect x="{x}" y="{y}" width="{w}" height="7" fill="{c}"/>')
    for (x, y, w) in GHOST:
        c = mono or S300
        op = '' if mono else ' fill-opacity=".55"'
        out.append(f'<rect x="{x}" y="{y}" width="{w}" height="3" fill="{c}"{op}/>')
    return ''.join(out)


def mark_svg(mono=None, size=None):
    wh = f' width="{size}" height="{round(size*72/76)}"' if size else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{MARK_VIEWBOX}"{wh}>{mark(mono)}</svg>'


def icon_svg(size=512, scale=.86, bg=A900):
    """Quadratisches App-Icon: Anthrazit-Fläche, Marke optisch zentriert."""
    g = f'<g transform="translate(50 50) scale({scale}) translate({-CX} {-CY})">{mark()}</g>'
    b = f'<rect width="100" height="100" fill="{bg}"/>' if bg else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="{size}" height="{size}">{b}{g}</svg>'


def vector_drawable(mono=False, scale=.78):
    """Android-Vektor für adaptive Icons (108dp, sichtbarer Bereich 72dp, Safe Zone 66dp)."""
    tx = 54 - CX * scale; ty = 54 - CY * scale
    paths = []
    for i, (x, y, w) in enumerate(BARS):
        col = '#FFFFFFFF' if mono else ('#FF3FA893' if i == 3 else '#FFD9DDE1')
        paths.append(f'        <path android:fillColor="{col}" android:pathData="M{x},{y}h{w}v7h-{w}z"/>')
    for (x, y, w) in GHOST:
        col = '#FFFFFFFF' if mono else '#FF9BA3AB'
        alpha = '' if mono else ' android:fillAlpha="0.55"'
        paths.append(f'        <path android:fillColor="{col}"{alpha} android:pathData="M{x},{y}h{w}v3h-{w}z"/>')
    return ('<?xml version="1.0" encoding="utf-8"?>\n'
            '<!-- PromptAir-Bildmarke (Silver-Applications-Stil). Generiert – Quelle: brand/logo.py -->\n'
            '<vector xmlns:android="http://schemas.android.com/apk/res/android"\n'
            '    android:width="108dp" android:height="108dp"\n'
            '    android:viewportWidth="108" android:viewportHeight="108">\n'
            f'    <group android:translateX="{tx:.3f}" android:translateY="{ty:.3f}"\n'
            f'        android:scaleX="{scale}" android:scaleY="{scale}">\n'
            + '\n'.join(paths) + '\n    </group>\n</vector>\n')
