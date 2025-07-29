from django.db import models
from core.models import User

class Game(models.Model):
    game_id = models.CharField(max_length=8, unique=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_games')
    player1 = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='p1_games')
    player2 = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='p2_games')
    status = models.CharField(max_length=20, default='waiting')
    winner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='won_games')
    created_at = models.DateTimeField(auto_now_add=True)