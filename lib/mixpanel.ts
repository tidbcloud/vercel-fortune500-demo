import mixpanel from "mixpanel-browser";
import { snakeCase } from "lodash-es";

if (process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
  mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN);
}

export const eventTracking: typeof mixpanel.track = (...args) => {
  mixpanel.track(...args);
};

function getDatasetByNamingConvention(o: DOMStringMap) {
  return Object.entries(o)
    .filter(
      (i) => i[0].startsWith("mp") && snakeCase(i[0]).split("_")?.[0] === "mp"
    )
    .reduce((acc, next) => {
      acc[next[0]] = next[1]!;
      return acc;
    }, {} as Record<string, string>);
}

export function enableAutoClickTracking(
  targetNode: Node & ParentNode = document,
  observerInit: MutationObserverInit = {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["data-mp-event", "href"],
  }
) {
  if (!process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
    return;
  }

  function trackClick(this: HTMLElement) {
    const payload: Record<string, string> = {
      from: window.location.href,
    };

    let eventName = "";
    const props = getDatasetByNamingConvention(this.dataset);
    if (props.mpEvent) {
      eventName = props.mpEvent;
      Object.assign(payload, props);
    } else if (this instanceof HTMLAnchorElement) {
      payload.to = this.href;
      if (this.host === window.location.host) {
        eventName = "Click Route Link";
      } else {
        eventName = "Click Outbound Link";
      }
    }

    if (eventName) {
      console.log("eventName: ", eventName);
      eventTracking(eventName, payload);
    }
  }

  const tracked: WeakSet<HTMLElement> = new WeakSet();

  function addNode(node: Node | ParentNode) {
    if (
      node instanceof HTMLAnchorElement ||
      node instanceof HTMLButtonElement
    ) {
      node.addEventListener("click", trackClick);
      tracked.add(node);
    } else if ("querySelectorAll" in node) {
      node.querySelectorAll("a").forEach(addNode);
      node.querySelectorAll("button").forEach(addNode);
    }
  }

  function removeNode(node: Node | ParentNode) {
    if (
      node instanceof HTMLAnchorElement ||
      node instanceof HTMLButtonElement
    ) {
      node.removeEventListener("click", trackClick);
      tracked.delete(node);
    } else if ("querySelectorAll" in node) {
      node.querySelectorAll("a").forEach(removeNode);
      node.querySelectorAll("button").forEach(removeNode);
    }
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "attributes") {
        removeNode(mutation.target);
        addNode(mutation.target);
      } else if (mutation.type === "childList") {
        mutation.addedNodes.forEach(addNode);
        mutation.removedNodes.forEach(removeNode);
      }
    });
  });

  targetNode.querySelectorAll("a").forEach(addNode);
  targetNode.querySelectorAll("button").forEach(addNode);

  observer.observe(targetNode, observerInit);

  return function cleanup() {
    observer.disconnect();
  };
}
