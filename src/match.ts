import { AccuracyEffectEvent, BackwardsEffectEvent, Chain, ChainedBall, ExplosionEffectEvent, Game, SlowEffectEvent } from "./types";
import { distance } from "./util";
import { Node } from "./types";
import { iterateToTail } from "./linkedList";

export function resolveMatches(game: Game, chain: Chain): {matches: boolean, cleared: number} {
  // we want to allow launched balls to fully become part
  // of the chain before resolving matches.
  if(chain.inserting) return {matches: false, cleared: 0};

  let last: Node<ChainedBall> | undefined = undefined;
  let start: Node<ChainedBall> | undefined = chain.head;
  let length = 1;

  let matches = false;
  // 演示版计分：本次调用中消除的球数（可能包含多段连续消除）
  let cleared = 0;
  for(const {node: current} of iterateToTail(chain.head)) {
    const lastBall = last?.value.ball;
    const didMatch = lastBall && lastBall.color === current.value.ball.color &&
    distance(lastBall.position, current.value.ball.position) < 2 * game.ballRadius + 1;
    if(didMatch) {
      length++;
    }
    
    const isFoot = current == chain.foot;
    if(!didMatch || isFoot) {
      // we are at a new color, so resolve the last match
      if(length >= 3) {
        // Include the current node in the iteration if it's a match and it's the foot
        const stopNode = (didMatch && isFoot) ? current.next : current;
        for(const {value: {effect, ball}} of iterateToTail(start, (node) => node !== stopNode)) {
          // 这一个节点就是将被消除的球，先计分再处理道具
          cleared += 1;

          if(!effect) continue;

          if(effect === 'explosion') {
            game.events.dispatchEvent(new ExplosionEffectEvent(ball.position));
          } else if(effect === 'slowEffect') {
            game.events.dispatchEvent(new SlowEffectEvent());
          } else if(effect === 'accuracyEffect') {
            game.events.dispatchEvent(new AccuracyEffectEvent())
          } else if(effect === 'backwardsEffect') {
            game.events.dispatchEvent(new BackwardsEffectEvent());
          }
        }

        if(chain.head === start) {
          if(didMatch && isFoot) {
            chain.head = undefined;
          } else {
            chain.head = current;
          }
        }
        if(isFoot && didMatch) {
          chain.foot = start?.previous;
        }

        matches = true;
        // I think there is a bug where matches at the foot
        // aren't handled

        // disappear balls in chain by changing pointers
        if(start?.previous) {
          if(isFoot && didMatch) {
            start.previous.next = undefined;
          } else {
            start.previous.next = current;
          }
        }
        current.previous = start?.previous;
        chain.pauseStepsAfterMatch = 30;
      }
  
      start = current;
      length = 1;
    }

    last = current;
  }

  return {matches, cleared};
}