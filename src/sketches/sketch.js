import p5 from "p5";
import dist from "react-p5-wrapper";

export default function sketch(p) {
  const text = "ALUCINA—ART—TECHNOLOGY—STUDIO";
  const symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>;@&%?=+/()";
  let waveTickness = 500;
  let isWave = false;
  let locs = [];
  let almostDone = [];
  let mouseTrail = [];
  let isMouseMoving = false;
  let mouseMoveEcho = false;
  let shift = false;
  let trailLastDistance = 0;
  let symbolsSpeed = 100;
  let color = p.color(220, 217, 214);
  let translate = { x: 0, y: 0 };
  let scale = 1;
  let radius;
  let symbolCounter = 0;
  let canvas;
  let distance;
  let isFocused;
  let focusCenter;
  let x, y;
  let difference;
  let alpha;
  let letter;

  p.setup = () => {
    canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    var res = 80;
    var countX = p.ceil(p.width / res);
    var countY = p.ceil(p.height / res);

    for (var j = 0; j < countY; j++) {
      for (var i = 0; i < countX; i++) {
        locs.push([
          new p5.Vector(
            res * i + res / 2,
            res * j + res,
            Math.floor(
              Math.random() * (Math.ceil(2) - Math.ceil(1) + 1) + Math.ceil(1)
            ) - 1
          ),
          symbols.charAt(Math.floor(Math.random() * symbols.length - 1)),
        ]);
        almostDone.push(
          Math.floor(
            Math.random() * (Math.ceil(2) - Math.ceil(1) + 1) + Math.ceil(1)
          ) - 1
        );
      }
    }

    setSymbols();
    setMouseTrace();

    p.textSize(12);
    p.textFont("Inter");
    p.mouseX = -1000;
    p.mouseY = -1000;
  };

  p.draw = () => {
    p.smooth();
    p.background(30, 37, 29);
    letter = -1;

    if (isWave) {
      radius += 40;
    } else {
      radius = 200;
      waveTickness = 500;
    }

    for (var i = 0; i < locs.length; i++) {
      if (i === 0) symbolCounter = symbolCounter < 1000 ? symbolCounter + 1 : 0;
      letter = letter > text.length - 1 ? 0 : letter + 1;
      isFocused = false;
      focusCenter = false;
      alpha = locs[i][0].z ? 255 : 25; //change

      p.push();
      p.translate(locs[i][0].x, locs[i][0].y);
      if (isWave) {
        distance = Math.sqrt(
          Math.pow(Math.abs(locs[i][0].x - p.mouseX), 2) +
            Math.pow(Math.abs(locs[i][0].y - p.mouseY), 2)
        );
        isFocused = distance < radius && distance > radius - waveTickness;

        if (distance < radius * 0.6 && distance > (radius - waveTickness) * 0.6)
          focusCenter = true;
        waveTickness -= waveTickness / 4000;

        scale =
          1 + 0.003 * (waveTickness - (distance - (radius - waveTickness)));

        //change
        alpha = locs[i][0].z
          ? 255
          : 25 + 0.003 * (waveTickness - (distance - (radius - waveTickness)));
      } else {
        for (const j in mouseTrail) {
          distance = Math.sqrt(
            Math.pow(Math.abs(locs[i][0].x - mouseTrail[j].x), 2) +
              Math.pow(Math.abs(locs[i][0].y - mouseTrail[j].y), 2)
          );

          if (distance < radius * 0.6) focusCenter = true;

          if (distance < radius) {
            isFocused = true;

            x =
              (distance +
                ((j < mouseTrail.length - 1 ? 12 : 15) -
                  (mouseTrail.length - j))) *
              Math.sin(
                Math.atan(
                  Math.abs(locs[i][0].x - mouseTrail[j].x) /
                    Math.abs(locs[i][0].y - mouseTrail[j].y)
                )
              );

            y =
              (distance +
                ((j < mouseTrail.length - 1 ? 12 : 15) -
                  (mouseTrail.length - j))) *
              Math.cos(
                Math.atan(
                  Math.abs(locs[i][0].x - mouseTrail[j].x) /
                    Math.abs(locs[i][0].y - mouseTrail[j].y)
                )
              );

            difference = {
              x: locs[i][0].x - mouseTrail[j].x || 1,
              y: locs[i][0].y - mouseTrail[j].y || 1,
            };

            translate = {
              x:
                (x - Math.abs(difference.x)) *
                (difference.x / Math.abs(difference.x)) *
                ((radius - distance) / radius),
              y:
                (y - Math.abs(difference.y)) *
                (difference.y / Math.abs(difference.y)) *
                ((radius - distance) / radius),
            };

            scale =
              1 +
              (j + 4) *
                (focusCenter ? 0.013 : 0.025) *
                ((radius - distance) / radius);

            alpha = locs[i][0].z
              ? 255
              : 25 + j * 100 * ((radius - distance) / radius); //change
          }
        }
      }
      color.setAlpha(alpha);
      p.fill(color);

      if (isFocused) {
        color.setAlpha(isWave && !locs[i][0].z ? 80 : alpha);
        if (focusCenter) {
          //p.translate(translate.x, translate.y);
          for (let j = mouseTrail.length - 1; j >= 0; j--) {
            if (
              symbolCounter %
                (isMouseMoving ? (j < mouseTrail.length - 1 ? 70 : 7) : 14) ===
              0
            ) {
              //console.log(i, j);
              locs[i][1] =
                symbols.charAt(
                  Math.floor(Math.random() * symbols.length - 1)
                ) || "—";
              break;
            }
          }
        }
        //console.log("---");
        if (!isWave) p.translate(translate.x * 3, translate.y * 3);
        p.scale(scale);
        p.textStyle(distance < radius ? p.BOLD : p.NORMAL);
        p.fill(color);
        p.text(
          ((isMouseMoving ||
            mouseMoveEcho ||
            (symbolsSpeed !== 100 &&
              symbolsSpeed !== 228 &&
              symbolsSpeed !== 356)) &&
            focusCenter) ||
            isWave
            ? symbolsSpeed > 300
              ? almostDone[i]
                ? locs[i][1]
                : text.charAt(letter) || "—"
              : locs[i][1]
            : text.charAt(letter) || "—",
          0,
          0
        );
      } else {
        p.text(text.charAt(letter) || "—", 0, 0);
      }

      p.pop();
    }
    //p.filter(p.BLUR, 1);
  };

  const setSymbolsSpeed = (i) => {
    if (!isMouseMoving && i < 9) {
      setTimeout(() => {
        symbolsSpeed += Math.pow(2, i);
        setSymbolsSpeed(i + 1);
      }, symbolsSpeed);
    } else {
      symbolsSpeed = 100;
    }
  };

  p.myCustomRedrawAccordingToNewPropsHandler = (newProps) => {
    if (canvas) {
      //Make sure the canvas has been created
      isMouseMoving = newProps.isMouseMoving;
      if (!isMouseMoving) {
        setSymbolsSpeed(0);
        setTimeout(() => {
          mouseMoveEcho = false;
        }, 1000);
      } else {
        symbolsSpeed = 100;
        mouseMoveEcho = true;
      }

      isWave = newProps.isWave;
      if (!isWave) {
        setTimeout(() => {
          mouseMoveEcho = false;
        }, 200);
      }
    }
  };

  const setSymbols = () => {
    /*
    setTimeout(
      () => {
        for (const i in locs) {
          locs[i][1] =
            symbols.charAt(Math.floor(Math.random() * symbols.length - 1)) ||
            "—";
        }
        setSymbols();
      },
      isWave ? 600 : symbolsSpeed
    );
    */
  };

  const setMouseTrace = () => {
    setTimeout(() => {
      shift = !shift;
      if (mouseTrail.length < 10) {
        mouseTrail.push({ x: p.mouseX, y: p.mouseY });
      } else {
        if (mouseTrail.length === 10) {
          mouseTrail.push({ x: p.mouseX, y: p.mouseY });
          trailLastDistance = {
            x:
              mouseTrail[mouseTrail.length - 1].x -
              mouseTrail[mouseTrail.length - 2].x,
            y:
              mouseTrail[mouseTrail.length - 1].y -
              mouseTrail[mouseTrail.length - 2].y,
          };
          if (
            Math.abs(trailLastDistance.x) > 500 ||
            Math.abs(trailLastDistance.y) > 500
          ) {
            for (let i = 0; i < 10; i++) {
              if (i < 5) {
                mouseTrail[i] = mouseTrail[i + 4];
              } else if (i < 9) {
                mouseTrail[i] = {
                  x:
                    mouseTrail[mouseTrail.length - 2].x +
                    (trailLastDistance.x / 5) * (i - 4),
                  y:
                    mouseTrail[mouseTrail.length - 2].y +
                    (trailLastDistance.y / 5) * (i - 4),
                };
              }
            }
          }
        }
        if (shift) mouseTrail.shift();
      }
      setMouseTrace();
    }, 30);
  };
}
