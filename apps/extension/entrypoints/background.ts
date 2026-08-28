import { captureFullPage } from '../src/application/capture-controller';

export default defineBackground(() => {
  chrome.action.onClicked.addListener((tab) => {
    void captureFullPage(tab);
  });
});
