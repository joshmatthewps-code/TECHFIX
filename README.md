# TechFix

Open `index.html` (the shell). It loads `game.html` and, per ticket, `desk.html` in iframes.

```
index.html  game.html  desk.html  firestore.rules
css/  shell.css game.css desk.css
js/   shell.js game.js game-firebase.js desk.js desk-quiz.js desk-init.js desk-firebase.js firebase-config.js
```

## Deploy (GitHub Pages)
1. Push everything to a repo; Settings > Pages > Deploy from branch `main` / root.
2. Firebase Console > Authentication > Settings > Authorized domains: add `<user>.github.io`.
3. Firebase Console > Firestore > Rules: paste `firestore.rules` > Publish.
4. Firebase project: edit only `js/firebase-config.js`.
5. Researcher page: `index.html?researcher=1`.
