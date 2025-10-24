import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ChatService } from '../chat-service';
import { catchError, pipe, throwError } from 'rxjs';

@Component({
  selector: 'app-simple-chat',
  imports: [MatCardModule, MatToolbarModule, MatInputModule, MatButtonModule, MatIconModule, FormsModule, NgClass],
  templateUrl: './simple-chat.html',
  styleUrls: ['./simple-chat.scss']
})
export class SimpleChat {

  @ViewChild('chatHistory')
  private chatHistory!: ElementRef;

  private chatService = inject(ChatService);

  userInput = ''; //prompt
  isLoading = false;

  local = false;

  messages = signal([
    { text: 'Hello, how can I help you today?', isBot: true}
  ])

  sendMessage() : void {
    this.trimUserMessage();
    if (this.userInput !== '' && !this.isLoading) {
      this.updateMessages(this.userInput);
      this.isLoading = true;
      //const message = this.userInput;
      //this.userInput = '';
      if (this.local) {
        this.simulateBotResponse();
      } else {
        this.sendChatMessage();
      }
    }
  }

  private sendChatMessage() {
    this.chatService.sendChatMessage(this.userInput)
    .pipe(
      catchError(() => {
        this.updateMessages('Sorry, I am unable to process your request at the moment', true);
        this.isLoading = false;
        return throwError(() => new Error('Error ocurred while sending chat message'));
      })

    )
    .subscribe(response =>  {
      this.updateMessages(response.message, true);
      this.userInput = '';
      this.isLoading = false;
    });
  }

  private updateMessages(text: string, isBot = false) : void {
    this.messages.update(messages => [...messages, { text: text, isBot: isBot }]);
    this.scrollToBottom();
  }

  private trimUserMessage() : void {
    this.userInput = this.userInput.trim();
  }

  private simulateBotResponse() : void {
    setTimeout((): void => {
      const response = 'This is a simulated response from Chat AI'; // Simulated response
      this.updateMessages(response, true);
      this.userInput = '';
      this.isLoading = false;
    }, 2000);
  }

  private scrollToBottom() : void {
    try {
      this.chatHistory.nativeElement.scrollTop = this.chatHistory.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
