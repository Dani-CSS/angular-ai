import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-simple-chat',
  imports: [MatCardModule, MatToolbarModule, MatInputModule, MatButtonModule, MatIconModule, FormsModule, NgClass],
  templateUrl: './simple-chat.html',
  styleUrl: './simple-chat.scss'
})
export class SimpleChat {

  @ViewChild('chatHistory')
  private chatHistory!: ElementRef;

  userInput = ''; //prompt

  isLoading = false;

  messages = signal([
    { text: 'Hello, how can I help you today?', isBot: true}
  ])

  sendMessage() : void {
    this.trimUserMessage();
    if (this.userInput !== '' && !this.isLoading) {
      this.updateMessages(this.userInput);
      this.isLoading = true;
      this.userInput = '';
      this.simulateBotResponse();
    }
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
      this.isLoading = false;
    }, 2000);
  }

  private scrollToBottom() : void {
    try {
      this.chatHistory.nativeElement.scrollTop = this.chatHistory.nativeElement.scrollHeight;
    } catch(err) { }
  }

}
