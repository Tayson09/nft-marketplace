module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run preview -- --host 127.0.0.1',
      url: [
        'http://127.0.0.1:4173/',
        'http://127.0.0.1:4173/nft/nft-1',
      ],
      numberOfRuns: 3,
    },
    assert: {
      preset: 'lighthouse:recommended',
    },
    upload: {
      target: 'filesystem',
    },
  },
}
