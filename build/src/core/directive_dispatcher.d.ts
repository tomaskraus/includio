/**
 * DirectiveDispatcher
 *
 * Gets an input line,
 *   returns a string content that depends on a directive on that input line.
 *
 * Directive's BNF:
 *   <directive> ::= "@@" <selector> | "@@" <selector> "|" <commands>
 *   <selector> ::= <file-name> | <file-name> ":" <part-name>
 *   <commands> ::= <command> | <commands> "|" <command>
 */
import { TIncludioOptions } from './common';
export declare const createDirectiveDispatcher: (options: TIncludioOptions) => (directiveLine: string) => Promise<string>;
