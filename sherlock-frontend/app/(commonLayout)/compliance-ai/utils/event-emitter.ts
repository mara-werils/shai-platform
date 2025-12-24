export const EVENTS = {
  STANDARDS_UPDATED: 'standards-updated',
  SOPS_UPDATED: 'sops-updated'
} as const;

type EventName = typeof EVENTS[keyof typeof EVENTS];

const eventSubscriptions = new WeakMap<object, Map<EventName, Set<Function>>>();

export const emitEvent = (eventName: EventName, data?: any) => {
  const event = new CustomEvent(eventName, { 
    detail: data,
    bubbles: false,
    cancelable: false
  });
  
  window.dispatchEvent(event);
};

export const subscribeToEvent = (
  eventName: EventName, 
  callback: (data?: any) => void,
  context: EventTarget = window
) => {
  if (!eventSubscriptions.has(context)) {
    eventSubscriptions.set(context, new Map());
  }
  
  const targetSubscriptions = eventSubscriptions.get(context)!;
  
  if (!targetSubscriptions.has(eventName)) {
    targetSubscriptions.set(eventName, new Set());
  }
  
  const eventCallbacks = targetSubscriptions.get(eventName)!;
  eventCallbacks.add(callback);
  
  const handler = (event: CustomEvent) => {
    if (eventCallbacks.has(callback)) {
      callback(event.detail);
    }
  };
  
  context.addEventListener(eventName, handler as EventListener);
  
  return () => {
    eventCallbacks.delete(callback);
    context.removeEventListener(eventName, handler as EventListener);
    
    if (eventCallbacks.size === 0) {
      targetSubscriptions.delete(eventName);
    }
    if (targetSubscriptions.size === 0) {
      eventSubscriptions.delete(context);
    }
  };
};

export const clearAllSubscriptions = () => {
  (eventSubscriptions as any) = new WeakMap();
};
